// DELIVERABLES:
// COMPLETE: 1. When the page loads, use fetch to get all of the pup data from your server. When you have this information, you'll need to add a span with the pup's name to the dog bar (ex: <span>Mr. Bonkers</span>).

// COMPLETE: 2. When a user clicks on a pup's span in the div#dog-bar, that pup's info (image, name, and isGoodDog status) should show up in the div with the id of "dog-info"

// COMPLETE: 3. When a user clicks the Good Dog/Bad Dog button, two things should happen:
// The button's text should change from Good to Bad or Bad to Good
// The corresponding pup object in the database should be updated to reflect the new isGoodDog value

// COMPLETE: BONUS:
// When a user clicks on the Filter Good Dogs button, two things should happen:
// The button's text should change from "Filter good dogs: OFF" to "Filter good dogs: ON", or vice versa.
// If the button now says "ON" (meaning the filter is on), then the Dog Bar should only show pups whose isGoodDog attribute is true. If the filter is off, the Dog Bar should show all pups (like normal).

document.addEventListener("DOMContentLoaded", (e) => {
  fetchPupData();
  let filterButton = document.querySelector("#good-dog-filter");
  filterButton = document.addEventListener("click", goodDogFilterClick);
});

function fetchPupData() {
  const dogBar = document.querySelector("#dog-bar");
  let dogInfoDiv = document.querySelector("#dog-info");
  fetch("http://localhost:3000/pups", {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  })
    .then((response) => response.json())
    .then((obj) => {
      // console.log("obj: ", obj);
      // console.log("typeof(obj): ", typeof(obj));
      obj.forEach(dog => {
        // console.log("dog", dog);
        let dogId = dog["id"];
        let dogDivTag = document.createElement("div");
        dogDivTag.id = dogId;
        let dogSpan = document.createElement("span");
        let dogName = dog["name"];
        dogSpan.textContent = dogName;

        let dogNameTag = document.createElement("h2");
        dogNameTag.textContent = dogName;

        let dogImageTag = document.createElement("img");
        let dogImage = dog["image"];
        dogImageTag.src = dogImage;

        let breakTag = document.createElement("br");

        let isGoodDogButton = document.createElement("button");
        let isGoodDog = dog["isGoodDog"];
        isGoodDogButton.classList.add("goodDogButton");

        isGoodDog === "true" ? isGoodDogButton.textContent = "Good Dog!" : isGoodDogButton.textContent = "Bad Dog!";

        isGoodDogButton.addEventListener("click", (e) => {
          // console.log("e: ", e);
          let goodDogDecision = false;
          if (isGoodDogButton.textContent === "Good Dog!") {
            isGoodDogButton.textContent = "Bad Dog!";
            goodDogDecision = false;
          }
          else if (isGoodDogButton.textContent === "Bad Dog!") {
            isGoodDogButton.textContent = "Good Dog!";
            goodDogDecision = true;
          }
          // fetch() request to make a 'PATCH' request to the existing 'dog' object within the 'db.json':
          let updateId = e.target.parentNode.id;
          // console.log("updateId: ", updateId);

          fetch(`http://localhost:3000/pups/${updateId}`, {
            method: "PATCH",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify({
              isGoodDog: goodDogDecision
            })
          })
            .then(() => {
              // console.log("Fetch request via 'POST' method complete!");
            })
            .catch((error) => {
              // console.log("error: ", error.message);
            });
        });

        // Add event listener for "click" event for span:
        dogSpan.addEventListener("click", () => {
          // dogInfoDiv.innerHTML = "";
          dogDivTag.append(dogNameTag, dogImageTag, breakTag, isGoodDogButton);
          dogInfoDiv.append(dogDivTag);
        });
        dogBar.append(dogSpan);
      });
    })
    .catch((error) => {
      // console.log("error: ", error.message);
    });

}

function dogSpanClick(dogNameTag, dogImageTag, breakTag, isGoodDogButton) {
  dogInfoDiv.append(dogNameTag, dogImageTag, isGoodDogButton);
}

function goodDogFilterClick(e) {
  // console.log("goodDogFilterClick() function called");
  // console.log("e.target.textContent: ", e.target.textContent);
  if (e.target.textContent === "Filter good dogs: OFF") {
    e.target.textContent = "Filter good dogs: ON";
    let dogInfoDivTag = document.querySelector("#dog-info");
    let dogDivTags = dogInfoDivTag.querySelectorAll("div");
    // console.log("dogDivTags: ", dogDivTags);

    dogDivTags.forEach((dogDivTag) => {
      let correspondingButton = dogDivTag.querySelector("button");
      // console.log("dogDivTag: ", dogDivTag);
      // console.log("correspondingButton: ", correspondingButton);
      // console.log("correspondingButton.textContent: ", correspondingButton.textContent);
      if (correspondingButton.textContent === "Bad Dog!") {
        // Idea to use 'style.visibility' taken from this Stack Overflow post:
        // https://stackoverflow.com/questions/9456289/how-to-make-a-div-visible-and-invisible-with-javascript
        dogDivTag.style.visibility = "hidden";
      }
    });
  }

  else if (e.target.textContent === "Filter good dogs: ON") {
    e.target.textContent = "Filter good dogs: OFF";
    let dogInfoDivTag = document.querySelector("#dog-info");
    let dogDivTags = dogInfoDivTag.querySelectorAll("div");
    // console.log("dogDivTags: ", dogDivTags);

    dogDivTags.forEach((dogDivTag) => {
      let correspondingButton = dogDivTag.querySelector("button");
      // console.log("dogDivTag: ", dogDivTag);
      // console.log("correspondingButton: ", correspondingButton);
      // console.log("correspondingButton.textContent: ", correspondingButton.textContent);
      if (correspondingButton.textContent === "Bad Dog!") {
        dogDivTag.style.visibility = "visible";
      }
    });
  }
}
