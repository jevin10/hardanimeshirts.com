# Nix flake for developing on nix machines.
# This compiles the prisma ORM engines from their binaries, so that it's compatible with nix machines.

{
  inputs.pkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.prisma-utils.url = "github:VanCoding/nix-prisma-utils";

  outputs = { pkgs, prisma-utils, ... }:
    let
      nixpkgs = import pkgs { system = "x86_64-linux"; };
      prisma = (prisma-utils.lib.prisma-factory {
        inherit nixpkgs;
        # Update these hashes from the "got: " output once you run "nix develop".
        # The hash to be updated will be specified from the "specified: " output
        # You'll need to run "nix develop" multiple times to get all the correct hashes
        prisma-fmt-hash = "sha256-iZuomC/KaLF0fQy6RVHwk2qq4DRaG3xj+sWmtLofiMU=";
        query-engine-hash = "sha256-Pl/YpYu326qqpbVfczM5RxB8iWXZlewG9vToqzSPIQo=";
        libquery-engine-hash = "sha256-ETwMIJMjMgZmjH6QGD7GVwYYlyx9mo2ydEeunFViCjQ=";
        schema-engine-hash = "sha256-rzzzPHOpUM3GJvkhU08lQ7rNspdq3RKxMRRW9YZtvhU=";
      }).fromNpmLock ./package-lock.json;  # or use .fromPnpmLock ./pnpm-lock.yaml for pnpm
    in
    {
      devShells.x86_64-linux.default = nixpkgs.mkShell { shellHook = prisma.shellHook; };
    };
}

