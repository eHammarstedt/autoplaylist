package com.richodemus.autoplaylist

import io.github.vjames19.futures.jdk8.flatMap
import io.github.vjames19.futures.jdk8.map
import org.slf4j.LoggerFactory
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import java.util.UUID
import java.util.concurrent.CompletableFuture

@CrossOrigin(origins = ["*"], maxAge = 3600)
@RestController
@SpringBootApplication
open class Application {
    private val logger = LoggerFactory.getLogger(Application::class.java)
    private val sessions = mutableMapOf<UUID, CompletableFuture<AccessToken>>()

    @PostMapping("/sessions")
    internal fun createSession(@RequestBody request: CreateSessionRequest): UUID {
        logger.info("req: $request")
        val uuid = UUID.randomUUID()
        sessions[uuid] = getToken(request.code)
                .map { it.accessToken }
        return uuid
    }

    @GetMapping("/sessions/{sessionId}/userId")
    internal fun getUser(@PathVariable("sessionId") sessionId: UUID): CompletableFuture<UserId> {
        val sessionFuture = sessions[sessionId]
        logger.info("Session future: $sessionFuture")
        return sessionFuture
                ?.flatMap { getUserId(it) }
                ?: throw RuntimeException("no such session")
    }

    @GetMapping("/sessions/{sessionId}/playlists")
    internal fun getPlaylists(@PathVariable("sessionId") sessionId: UUID): CompletableFuture<List<PlayList>> {
        return sessions[sessionId]
                ?.flatMap { getPlaylists(it) }
                ?.map { it.items }
                ?: throw RuntimeException("no such session")
    }
}

data class CreateSessionRequest(val code: String)

fun main(args: Array<String>) {
    SpringApplication.run(Application::class.java, *args)
}
