package com.richodemus.autoplaylist

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonValue
import com.fasterxml.jackson.module.kotlin.readValue
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.Request
import com.github.kittinunf.result.Result
import io.github.vjames19.futures.jdk8.map
import org.slf4j.LoggerFactory
import java.net.URL
import java.net.URLEncoder
import java.util.UUID
import java.util.concurrent.CompletableFuture

private val logger = LoggerFactory.getLogger("SpotifyClient")

internal fun buildClientUrl() = URL(
        "https://accounts.spotify.com/authorize?response_type=code" +
                "&client_id=${clientId().encode()}" +
                "&scope=${scope()}" +
                "&redirect_uri=${redirectUrl().encode()}" +
                "&state=${UUID.randomUUID().toString().encode()}" +
                "&show_dialog=false"
)

internal fun getToken(code: String): CompletableFuture<Tokens> {
    return Fuel.post("https://accounts.spotify.com/api/token",
            listOf(
                    "grant_type" to "authorization_code",
                    "code" to code,
                    "redirect_uri" to redirectUrl(),
                    "client_id" to clientId(),
                    "client_secret" to clientSecret()
            ))
            .deserialize()
}

internal fun getUserId(accessToken: AccessToken): CompletableFuture<UserId> {
    return Fuel.get("https://api.spotify.com/v1/me")
            .header("Content-Type" to "application/json")
            .header("Authorization" to "Bearer $accessToken")
            .deserialize<User>()
            .map { it.id }
}

internal fun getPlaylists(accessToken: AccessToken): CompletableFuture<PlayListsResponse> {
    return Fuel.get("https://api.spotify.com/v1/me/playlists")
            .header("Content-Type" to "application/json")
            .header("Authorization" to "Bearer $accessToken")
            .deserialize()
}

private inline fun <reified T : Any> Request.deserialize(): CompletableFuture<T> {
    val future = CompletableFuture<T>()
    this.responseString { _, _, result ->
        when (result) {
            is Result.Failure -> {
                val ex = result.getException()
                logger.error("Call failed: $result", ex)
                future.completeExceptionally(ex)
            }
            is Result.Success -> {
                val data = result.get()
                val playListsResponse = mapper.readValue<T>(data)
                future.complete(playListsResponse)
            }
        }
    }
    return future
}

private fun String.encode() = URLEncoder.encode(this, "utf-8")

internal data class Tokens(
        @JsonProperty("access_token") val accessToken: AccessToken,
        @JsonProperty("scope") val scope: String,
        @JsonProperty("token_type") val tokenType: String,
        @JsonProperty("expires_in") val expiresIn: Int,
        @JsonProperty("refresh_token") val refreshToken: String
)

internal data class AccessToken(@get:JsonIgnore val value: String) {
    init {
        require(value.isNotBlank()) { "AccessToken can't be empty" }
    }

    @JsonValue
    override fun toString() = value
}

internal data class User(val id: UserId)
internal data class UserId(@get:JsonIgnore val value: String) {
    init {
        require(value.isNotBlank()) { "UserId can't be empty" }
    }

    @JsonValue
    override fun toString() = value
}

internal data class PlayListsResponse(val items: List<PlayList>, val total: Int)
internal data class PlayList(val id: String, val name: String)