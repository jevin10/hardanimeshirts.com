{
  inputs.pkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.prisma-utils.url = "github:VanCoding/nix-prisma-utils";

  outputs = { pkgs, prisma-utils, ... }:
    let
      nixpkgs = import pkgs { system = "x86_64-linux"; };
      prisma = (prisma-utils.lib.prisma-factory {
        inherit nixpkgs;
        prisma-fmt-hash = "sha256-wa4p2NNR8IdW2yar4L5vYfTawnadzub4klxkhXBVz+A="; # Updated hash
        query-engine-hash = "sha256-k9ePnzIEBdbVLxgdR1moQaqEWZ9jlZdyaKtOwbJtA7o=";
        libquery-engine-hash = "sha256-M+xXlMybY6dgZ3kCYTAUccEmJPFYYVVvn7LWiC0wnr0=";
        schema-engine-hash = "sha256-oqIt4Drcsz+Jt415YV8VxgoVM/kZdoK/XnlFhg9viVo=";
      }).fromNpmLock ./package-lock.json;  # or use .fromPnpmLock ./pnpm-lock.yaml for pnpm
    in
    {
      devShells.x86_64-linux.default = nixpkgs.mkShell { shellHook = prisma.shellHook; };
    };
}

