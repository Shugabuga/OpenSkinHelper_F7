# OpenSkinHelper *for Framework7*
![](https://raw.githubusercontent.com/Shugabuga/OpenSkinJS/master/OpenSkin.png)

*OpenSkin: The Flexible and Open Skin Format*

## Introduction

OpenSkin is a proposed file format based off of the JSON syntax that will ([try to](https://xkcd.com/927/)) make a standardized format for application theming. It is based off of the skin format of web-based GameBoy Advance emulator [iGBA (now Eclipse)](https://eclipseemu.me), but expanded to be used for non-emulators and to enrich the capabilities of their theming system, as it was quite limited in its standard state.

## The Library

OpenSkinHelper is a helper script for [OpenSkinJS](https://github.com/Shugabuga/OpenSkinJS/) that will make it easier to implement in your app. It has all the code needed for implementing skins in your app in minutes.

## Setup

To set up OpenSkin and OpenSkinHelper in your project, add the following towards the end of the page (to reduce page load time):

```html
<!-- OpenSkin -->
<script>
  var openskin = "appName"; // Set app name
  var openskinDefault = "https://shuga.co/openskinDefault.json"; // Set default skin URL
</script>
<script src="js/openskin.js"></script>
<script src="js/openskinHelper.js"></script>
<!-- /OpenSkin -->
```

Make sure to replace `appName` with your web app's name, and `https://shuga.co/openskinDefault.json` with a new default skin URL (if you wish). This is used for skin developers to fine-tune their skins for your site (if needed), and for setting the default skin in the skin picker.

## OpenSkinJS Documentation

Please check out the [main GitHub](https://github.com/Shugabuga/OpenSkinJS/) for proper documentation and APIs.

## Usage

### Opening the Skin Viewer

`OpenSkinHelper.popup()`: Brings up the OpenSkinHelper GUI for the user.
`OpenSkinHelper.apply(url)`: Applies the current skin and allows it to be loaded on app start.
`OpenSkinHelper.addPopup()`: Displays a dialog box to add a new skin.
`OpenSkinHelper.add(url)`: Add a skin to the skin list.
`OpenSkinHelper.remove(url)`: Removes a skin to the skin list.
`OpenSkinHelper.list()`: Gets the current skin list.


## Reporting Bugs

### Vulnerabilities (i.e. XSS)

Please contact [HeyItsShuga](https://twitter.com/HeyItsShuga) immediately.

### Everything Else

Please use the Issues tab to report any bugs that don't compromise security.
