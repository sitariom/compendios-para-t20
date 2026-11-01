# playlists-specification Specification

## Purpose
The playlists-specification capability defines the authoritative specification and quality contracts for creating and validating all Playlist documents in `packs/Playlist_T20` for the Tormenta20 system on Foundry VTT.

## Requirements

### Requirement: Playlist Data Structure and Playback Modes
Every Playlist document SHALL define its playback mode (`mode`: `0` sequential, `1` shuffle, `2` simultaneous, `3` soundboard), volume (`volume`: 0.0 to 1.0), and a collection of `sounds` referencing valid audio assets.

#### Scenario: Playing an ambient background soundscape
- **GIVEN** an ambient playlist such as Forest or Tavern
- **WHEN** the playlist playback is initiated
- **THEN** it executes under the configured mode without audio distortion
- **AND** respects the default volume level

### Requirement: Playlist Sound Subdocument Architecture
Individual sound tracks SHALL be registered as subdocuments under `!playlists.sounds!${playlistId}.${soundId}` containing track `name`, audio source `path` (relative or streaming URI), `volume`, `repeat` loop setting, and fade duration.

#### Scenario: Registering combat sound effects
- **GIVEN** sound files added to a combat playlist
- **WHEN** the playlist is compiled into LevelDB
- **THEN** each track is stored with valid ID and duration metadata
- **AND** loops correctly when `repeat: true` is configured
