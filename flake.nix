{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-23.11";
    systems.url = "github:nix-systems/default";
    rust-overlay.url = "github:oxalica/rust-overlay";
    devenv = {
      url = "github:cachix/devenv";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  nixConfig = {
    extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs = {
    self,
    nixpkgs,
    systems,
    rust-overlay,
    devenv,
    ...
  } @ inputs: let
    overlays = [(import rust-overlay)];
    forEachSystem = nixpkgs.lib.genAttrs (import systems);
  in {
    packages = forEachSystem (
      system: let
        # dbPort = "5433";
        pkgs = import nixpkgs {inherit system overlays;};
        rustVersion = pkgs.rust-bin.stable.latest.default;
        rustPlatform = pkgs.makeRustPlatform {
          cargo = rustVersion;
          rustc = rustVersion;
        };
        sanitasBackendPackage = rustPlatform.buildRustPackage {
          pname = "sanitas_backend";
          version = "0.1.0";
          src = ./backend;
          cargoLock.lockFile = ./backend/Cargo.lock;
        };
      in {
        # For setting up devenv
        devenv-up = self.devShells.${system}.default.config.procfileScript;

        # Sanitas backend docker image, generate it using:
        # `nix run .#sanitasBackendDocker`
        sanitasBackendDocker = pkgs.dockerTools.buildImage {
          name = "sanitas_backend_img";
          tag = "latest";

          copyToRoot = pkgs.buildEnv {
            name = "image-root";
            paths = [sanitasBackendPackage];
            pathsToLink = ["/"];
          };

          config = {
            Cmd = [
              "/${sanitasBackendPackage}/bin/sanitas_backend"
            ];
          };
        };
      }
    );

    devShells = forEachSystem (system: let
      pkgs = import nixpkgs {inherit system overlays;};
    in {
      default = devenv.lib.mkShell {
        inherit pkgs inputs;
        modules = [
          {
            packages = with pkgs; [
              # Utilities
              rm-improved

              # Database
              postgresql
              sqlfluff # SQL linter and formatter

              # Backend
              (rust-bin.stable.latest.default)

              # Frontend
              nodejs_20
              yarn
              dprint # Javascript formatter
              oxlint # Javascript linter
            ];
            enterShell = ''
              alias rm=rip
            '';
          }
        ];
      };
    });
  };
}
