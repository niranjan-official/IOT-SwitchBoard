let switches = {};
const database = firebase.database();

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
var dynamicTextElements = document.querySelectorAll(".row p");

// Load stored texts from localStorage
dynamicTextElements.forEach(function (element) {
  var storedText = localStorage.getItem(element.id);
  if (storedText) {
    element.textContent = storedText;
  }

  element.addEventListener("input", function () {
    var newText = element.textContent;
    localStorage.setItem(element.id, newText);
  });
});
