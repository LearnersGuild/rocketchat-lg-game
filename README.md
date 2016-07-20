# DEPRECATED: this repo has been merged into [echo-chat][echo-chat]

# learnersguild:rocketchat-lg-game

Custom functionality for the Learners Guild game (including slash commands for Rocket.Chat).

**NOTE:** This package will likely not be useful for anyone outside of [Learners Guild][learnersguild].

## Getting Started (Dev)

Be sure you've read the [instructions for contributing](./CONTRIBUTING.md).

1. Get your local [IDM][IDM] up and running.

2. Get your local [Rocket.Chat][Rocket.Chat] up and running.

3. Clone this repository.

4. From your local Rocket.Chat repository's `packages` folder, add a symlink to this repo, then add the package:

        $ ln -s ../rocketchat-lg-slash-commands .
        $ meteor add learnersguild:rocketchat-lg-slash-commands

5. Export the `JWT_PUBLIC_KEY` from your IDM instance:

        $ export JWT_PUBLIC_KEY="<same public key from your IDM instance>"

6. Start the server.

        $ meteor

7. Visit the server in your browser:

        $ open http://localhost:3000


## License

See the [LICENSE](./LICENSE) file.


[IDM]: https://github.com/LearnersGuild/idm
[echo-chat]: https://github.com/LearnersGuild/echo-chat
[Rocket.Chat]: https://github.com/LearnersGuild/Rocket.Chat
[learnersguild]: https://www.learnersguild.org/
