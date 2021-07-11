# Testing for Milestron Project 2 - CampZilla
---

## Chrome Developer Tools - Lighthouse

- Home Page - Desktop

![Home Page - Desktop](lighthouse-results/home-desktop.png)

- Home Page - Mobile

![Home Page - Mobile](lighthouse-results/home-mobile.png)

---

## Testing Process - User

1. Load site
2. Click dark mode button
3. scroll to about section to read
4. Enter a search term
5. Click on a random result title to focus map
6. Click on the map marker for more information
7. Go to result and click on more information
8. Toggle the Hourly/Daily weather(Desktop Only)
9. Adjust radius of search area and update
10. Repeat 5-8 on a different result
11. Click the geolocation search button
12. Repeat 5-8 on a result
13. Click Contact Us Nav buton and send a message

## Chrome Developer Tools

---
### iPhone 5/SE 320x568 & 568x320

During testing, 4 issues arose as state below. These were resolved first by testing solutions in Chrome Dev Tools, then implementing them in the project files.
A noted inconvenince was that scrolling down the page was difficult with the map open and you needed to scroll from the top. To fix this, the window was made to scroll down slightly, allowing sscrolling from below easily

- Bug: When the screen size switched to medium, the geolocation button would be behind the map container when a search happened.
    - Solution: Added a media query to move the button when the screen size went below 992px
- Bug: Website address going off page due to long address.
    - Solution: added word-wrap:breakwork to class of website address
- Bug: Marker text was white, causing it to be invisible
    - Solution: Added class to marker box, use specificity to set p tags and a tags to black
- Bug: Contact reason box extended out of the modal
    - Solution: Changed width to 100% to match other. Also matched height to other input boxes
- Bug: On mobile or displays with less height, it was hard to scroll down as the map would zoom.
    - Solution: Page automatically reposition on search

---
### iPhone 6/7/8 357x667 & 667x357

During testing, no issues were spotted

---
### iPhone 6/7/8 Plus 414x736 & 736x414

During testing no issues were spotted, but a visual design changed was implemeted. The weather display was moved to under the title

---
### iPad 768x1024 & 1024x768

During tested it was noticed that the current weather div was hading before it should, leaving the result hald empty. The media query doing this was adjust to fix it.
- Bug: Weather in result hiding before it should
    - Solution: Media query adjust from max-width:768px to 767px

---
### iPad Pro 1024x1336 1336x1024

During testing, no issues were spotted

---
## Handheld Device Realworld Testing - Testing Log
---
### iPhone XS Max (Safari)

During testing, no issues were spotted

---
### iPhone 12 Pro (Safarai)

---
### iPad Pro 11 (Safari)

During testing, no issues were spotted

---
### Samsung A40 (Chrome)

During testing, no issues were spotted

---
## Screen Testing - Testing Log
---
### Laptop 13" Screen 1280x800

During testing, it was spotted that the Dark Mode / Light Mode text wasn't changing to white
- Bug: class not taking effect on the element
    - Solution: element was set as a div instead of a p tag. Changed to P and functionality returned

---
### Laptop 16" Screen 3072x1920

During testing, no issues were spotted

---
### Desktop 22" Screen 1680x1050

During testing, no issues were spotted


---
### iMac 5k 27" Screen 5120x2880
During testing, no issues were spotted

---

