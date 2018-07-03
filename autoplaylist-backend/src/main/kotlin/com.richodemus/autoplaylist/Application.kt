package com.richodemus.autoplaylist

import io.github.vjames19.futures.jdk8.Future
import io.github.vjames19.futures.jdk8.flatMap
import io.github.vjames19.futures.jdk8.zip
import org.slf4j.LoggerFactory
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.ModelAndView
import java.util.concurrent.CompletableFuture

@RestController
@SpringBootApplication
open class Application {
    private val logger = LoggerFactory.getLogger(Application::class.java)

    @GetMapping("/login")
    fun login() = ModelAndView("redirect:" + buildClientUrl())

    @GetMapping("/callback")
    fun callback(@RequestParam(value = "state") state: String,
                 @RequestParam(value = "code", required = false) code: String?,
                 @RequestParam(value = "error", required = false) error: String?
    ): CompletableFuture<String> {
        if (error == "access_denied") {
            logger.warn("State {} denied permissions")
            return Future {
                "<html><body>No permisonerino</body></html>"
            }
        }

        if (code == null) {
            logger.error("State {} no code despite no error")
            return Future {
                "<html><body>No idea what happened, your state is $state</body></html>"
            }
        }

        logger.info("Code: {}", code)
        logger.info("State: {}", state)
        logger.info("Error: {}", error)

        val tokenFuture = getToken(code)

        val userIdFuture = tokenFuture.flatMap { getUserId(it.accessToken) }
        val playlistsFuture = tokenFuture.flatMap { getPlaylists(it.accessToken) }

        return userIdFuture.zip(playlistsFuture) { userId, playListsResponse ->
            """
                <html>
                    <body>
                    Hi $userId </br>
                    <a href="/">back</a> </br>
                    Playlists: </br>
                    <ul>
                    ${playListsResponse.items.joinToString(separator = "") { "<li>${it.name}</li>" }}
                    </ul>
                    </body>
                </html>
            """.trimIndent()
        }
    }
}

fun main(args: Array<String>) {
    SpringApplication.run(Application::class.java, *args)
}
