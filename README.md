# Generate Ubuntu Preferences from APT list #

Helper script to convert output from apt list into preferences file.
This is used to lock an Ubuntu APT version to the exact setup used in another machine.
After running the application, copy the preferences file to `/etc/apt/preferences`.

Depending on the pin-priority value, `apt` will prefer or demand the specific version listed.

## Building from source ##

Install nvm and set node version to 12.16.2

```sh
nvm install 12.16.2
nvm use 12.16.2
```

Subsequently, only the following needs to be run

```sh
npm run build
```

## Method 1. Generate directly from current system ##

Generate directly from current system with pin-priority of 1001

```sh
./aptpref -p 1001
```

## Method 2. Generate from file ##

```sh
sudo apt list > apt_list.txt
./aptpref -f apt_list.txt -p 1001
```
