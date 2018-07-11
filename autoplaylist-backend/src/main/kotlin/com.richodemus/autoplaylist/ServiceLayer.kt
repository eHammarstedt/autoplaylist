package com.richodemus.autoplaylist

import io.github.vjames19.futures.jdk8.Future
import io.github.vjames19.futures.jdk8.flatMap
import io.github.vjames19.futures.jdk8.map
import io.github.vjames19.futures.jdk8.zip
import java.util.concurrent.CompletableFuture

internal fun createPlayListFromArtist(
        accessToken: AccessToken,
        userId: UserId,
        playlistName: PlaylistName,
        artistName: ArtistName): CompletableFuture<List<TrackName>> {
    val tracksFuture = getTracks(accessToken, artistName)

    val createPlaylistFuture = tracksFuture
            .map { it.map { it.uri } }
            .flatMap { tracks ->
                createPlaylist(accessToken, userId, playlistName, tracks)
            }

    return createPlaylistFuture
            .zip(tracksFuture)
            .map { it.second }
            .map { it.map { it.name } }

}


internal fun getTracks(validToken: AccessToken, artistName: ArtistName): CompletableFuture<List<Track>> {
    return findArtist(validToken, artistName)
            .map { artist -> Pair(validToken, artist) }
            .map {
                println(it.second)
                Pair(it.first, it.second.first())
            }.flatMap {
                getAlbums(it.first, it.second.id).map { albums -> Pair(it.first, albums) }
            }.map {
                println("Albums:")
                it.second.forEach { println("\t" + it) }
                it.second.filterNot { it.album_group == "appears_on" }.map { album -> getTracks(it.first, album.id) }
            }.flatMap { futures ->
                Future {
                    futures.map { it.join() }
                }
            }.map {
                it.flatMap { it }
            }
}

internal fun createPlaylist(
        accessToken: AccessToken,
        userId: UserId,
        artist: PlaylistName,
        trackUris: List<TrackUri>)
        : CompletableFuture<List<SnapshotId>> {
    return createPlaylist(
            accessToken,
            userId,
            artist,
            "autogenerated",
            false)
            .map { it.id }
            .map { playListId ->
                println("playlist id: $playListId")
                val chunks = trackUris.chunked(100)
                chunks.map {
                    addTracks(accessToken, UserId("richodemus"), playListId, it)
                }
            }.flatMap { futures ->
                Future {
                    futures.map { it.join() }
                }
            }
}