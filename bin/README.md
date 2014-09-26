Expectations of binaries living in these directories

* you will accept `--long-arguments`
* you will emit json by default and comma-separated records if passed `--raw`.
* to the extent possible, to avoid code duplication and to aid in encapsulation, place shared code in `components/common/` and include as necessary.
* you will examine, in order of preference, the environment variables (defined for the moment in `contrib/`), `--arguments`, and subsequently configuration in `etc/`, and fail loudly should anything remain undefined rather than make assumptions about intent.
* unless your task is irreducible (such as `build-node`), you will use the provided toolchain rather than make explicit calls to AWS IAM, the datastore, github, or other data/identity providers.