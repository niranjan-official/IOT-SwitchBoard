let switches = {};
const database = firebase.database();
var speed = 0;
var speedPointer = document.getElementById("pointer");

function initializeSwitch(switchId, switchInitialized) {
  const switchElement = document.getElementById(switchId);

  if (!switchElement) {
    console.error(`Switch element with ID '${switchId}' not found.`);
    return;
  }

  switches[switchId] = {
    element: switchElement,
    value: null,
  };

  // Listen for changes in Firebase for the specific switch
  database.ref(`/${switchId}`).on(
    "value",
    (snapshot) => {
      // Get the updated data from the snapshot
      switches[switchId].value = snapshot.val();
      switches[switchId].element.checked = switches[switchId].value === 1;
      console.log(`${switchId} initial value:`, switches[switchId].value);
      if (switchId == "switch-4") {
        switchInitialized();
      }
    },
    (error) => {
      // Handle any errors
      console.error(error);
    }
  );
  // Get the speed of Regulator

  switches[switchId].element.addEventListener("change", () => {
    const switchValue = switches[switchId].element.checked;
    console.log(`Switch ${switchId} changed:`, switchValue);
    switches[switchId].value = switchValue ? 1 : 0;

    // Update the value in Firebase for the specific switch
    database
      .ref(`/${switchId}`)
      .set(switches[switchId].value)
      .then(() => {
        console.log(`Switch ${switchId} value updated successfully`);
      })
      .catch((error) => {
        console.error(`Error updating value for switch ${switchId}:`, error);
      });
  });
}
function regulateSpeed() {
  database.ref("/value").on(
    "value",
    (snapshot) => {
      speed = snapshot.val();

      switch (speed) {
        case 0:
          speedPointer.style.transform = "translate(-50%, -50%) rotate(0deg)";
          break;

        case 1:
          speedPointer.style.transform = "translate(-50%, -50%) rotate(45deg)";
          break;

        case 2:
          speedPointer.style.transform = "translate(-50%, -50%) rotate(90deg)";
          break;

        case 3:
          speedPointer.style.transform = "translate(-50%, -50%) rotate(135deg)";
          break;

        case 4:
          speedPointer.style.transform = "translate(-50%, -50%) rotate(180deg)";
          console.log("case 4 done");
          break;

        default:
          console.log("No such case exist");
          break;
      }

      console.log(">>>>", speed);
    },
    (error) => {
      // Handle any errors
      console.error(error);
    }
  );
}

var editElement = document.getElementById("edit");
var access = document.getElementsByClassName("switch-font");
var dynamicTextElements = document.querySelectorAll(".row p");
var editorLogo = document.getElementById("editor-logo");

dynamicTextElements.forEach(function (element) {
  var storedText = localStorage.getItem(element.id);
  if (storedText) {
    element.textContent = storedText;
  }
});

editElement.addEventListener("change", function () {
  var editAccess = event.target.checked;
  console.log(event.target.checked);
  if (editAccess) {
    editorLogo.innerHTML = "";
    editorLogo.classList.add("checked-logo");

    for (let i = 0; i < access.length; i++) {
      access[i].contentEditable = true;
      access[i].style.border = "2px solid #ffa600";
    }

    // Load stored texts from localStorage
    dynamicTextElements.forEach(function (element) {
      element.addEventListener("input", function () {
        var newText = element.textContent;
        localStorage.setItem(element.id, newText);
      });
    });
  } else {
    editorLogo.classList.remove("checked-logo");
    editorLogo.innerHTML = '<img src="images/settings-24-xxl.png" alt="">';

    for (let i = 0; i < access.length; i++) {
      access[i].contentEditable = false;
      access[i].style.border = "";
    }
  }
});

function reduceSpeed() {
  if (speed > 0) {
    speed--;
    database
      .ref("/value")
      .set(speed)
      .then(() => {
        console.log(`Speed changed to ${speed}`);
      })
      .catch((error) => {
        console.error(`Error`, error);
      });
  }
  console.log("reduce function called");
}
function increaseSpeed() {
  if (speed < 4) {
    speed++;
    database
      .ref("/value")
      .set(speed)
      .then(() => {
        console.log(`Speed changed to ${speed}`);
      })
      .catch((error) => {
        console.error(`Error`, error);
      });
  }
  console.log("increase function called");
}
