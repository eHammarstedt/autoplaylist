package com.richodemus.autoplaylist

import io.github.vjames19.futures.jdk8.Future
import io.github.vjames19.futures.jdk8.flatMap
import io.github.vjames19.futures.jdk8.map
import io.github.vjames19.futures.jdk8.zip
import org.slf4j.LoggerFactory
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.ModelAndView
import java.util.UUID
import java.util.concurrent.CompletableFuture

@RestController
@SpringBootApplication
open class Application {
    private val logger = LoggerFactory.getLogger(Application::class.java)
    private val playlists = mutableMapOf<UUID, List<PlayList>>()

    @GetMapping("/login")
    fun login() = ModelAndView("redirect:" + buildClientUrl())

    @RequestMapping("/callback")
    fun callback(@RequestParam(value = "state") state: String,
                 @RequestParam(value = "code", required = false) code: String?,
                 @RequestParam(value = "error", required = false) error: String?
    ): CompletableFuture<ModelAndView> {
        if (error == "access_denied") {
            logger.warn("State {} denied permissions")
            return Future {
                ModelAndView("redirect:http://localhost:3000?error=denied")
            }
        }

        if (code == null) {
            logger.error("State {} no code despite no error")
            return Future {
                ModelAndView("redirect:http://localhost:3000?error=unknown")
            }
        }

        logger.info("Code: {}", code)
        logger.info("State: {}", state)
        logger.info("Error: {}", error)

        val tokenFuture = getToken(code)

        val userIdFuture = tokenFuture.flatMap { getUserId(it.accessToken) }
        val playlistsFuture = tokenFuture.flatMap { getPlaylists(it.accessToken) }

        val allDone = userIdFuture.zip(playlistsFuture)
                .map { (userId, playList) ->
                    Triple(userId, playList, UUID.randomUUID())
                }

        allDone.map { (_, playList, sessionId) ->
            playlists.put(sessionId, playList.items)
        }

        return allDone.map { (userId, _, sessionId) ->
            ModelAndView("redirect:http://localhost:3000?session=$sessionId&userId=$userId\"")
        }
    }

    @CrossOrigin(origins = ["*"])
    @GetMapping("/playlists/{sessionId}")
    internal fun getPlaylists(@PathVariable(value = "sessionId") sessionId: String): List<PlayList>? {
        return playlists[UUID.fromString(sessionId)]
    }
}

fun main(args: Array<String>) {
    SpringApplication.run(Application::class.java, *args)
}
