
let switches = {};
const database = firebase.database();

function initializeSwitch(switchId) {
    const switchElement = document.getElementById(switchId);

    if (!switchElement) {
        console.error(`Switch element with ID '${switchId}' not found.`);
        return;
    }

    switches[switchId] = {
        element: switchElement,
        value: null
    };

    // Listen for changes in Firebase for the specific switch
    database.ref(`/${switchId}`).once('value', (snapshot) => {
        // Get the updated data from the snapshot
        switches[switchId].value = snapshot.val();
        switches[switchId].element.checked = switches[switchId].value === 1;
        console.log(`${switchId} initial value:`, switches[switchId].value);
    }, (error) => {
        // Handle any errors
        console.error(error);
    });


    switches[switchId].element.addEventListener('change', () => {
        const switchValue = switches[switchId].element.checked;
        console.log(`Switch ${switchId} changed:`, switchValue);
        switches[switchId].value = switchValue ? 1 : 0;

        // Update the value in Firebase for the specific switch
        database.ref(`/${switchId}`).set(switches[switchId].value)
            .then(() => {
                console.log(`Switch ${switchId} value updated successfully`);
            })
            .catch((error) => {
                console.error(`Error updating value for switch ${switchId}:`, error);
            });
    });
}

  // Listen for changes in the switch state
//   function updateValue(switchID){
//       switches[switchID].element.addEventListener('change', (event) => {
//       const switchValue = event.target.checked;
//     console.log(document.getElementById(switchID).checked);
//     console.log(`Switch ${switchID} changed:`, switchValue);
//     switches[switchID].value = switchValue ? 1 : 0;

//     // Update the value in Firebase for the specific switch
//     database.ref(`/${switchID}`).set(switches[switchID].value)
//       .then(() => {
//         console.log(`Switch ${switchID} value updated successfully`);
//       })
//       .catch((error) => {
//         console.error(`Error updating value for switch ${switchID}:`, error);
//       });
//   });
// }

