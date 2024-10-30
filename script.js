// db.collection("cities").doc("LA").set({
//     name: "Los Angeles",
//     state: "CA",
//     country: "USA"
// })
// .then(() => {
//     console.log("Document successfully written!");
// })
// .catch((error) => {
//     console.error("Error writing document: ", error);
// });

// db.collection("cities").doc("DC").set({
//     name: "Washington",
//     state: "DC",
//     country: "USA",
//     capital: false
// })
// .then(() => {
//     console.log("Document successfully written!");
// })
// .catch((error) => {
//     console.error("Error writing document: ", error);
// });

// var washingtonRef = db.collection("cities").doc("DC");

// // Set the "capital" field of the city 'DC'
// washingtonRef.update({
//     capital: true
// })
// .then(() => {
//     console.log("Document successfully updated!");
// })
// .catch((error) => {
//     // The document probably doesn't exist.
//     console.error("Error updating document: ", error);
// });


// // Atomically add a new region to the "regions" array field.
// washingtonRef.update({
//     regions: firebase.firestore.FieldValue.arrayUnion("greater_virginia")
// });

// // Atomically remove a region from the "regions" array field.
// washingtonRef.update({
//     regions: firebase.firestore.FieldValue.arrayRemove("east_coast")
// });

const form = document.querySelector('form');
const button = document.querySelector('button');
// you can take a query selector of a specific class
const text = document.querySelector(".output");

const buttons = document.querySelector(".buttons");

let roomCode = 'ABCD';
let gamePhase = 0; //0 will be home screen, 1 can be waiting for players

var signup = document.getElementById("signup");
var pregame = document.getElementById("pregame");

let number = '';

function updateGamePhase(phase){
    gamePhase = phase;
    if (gamePhase == 0){ //player enter details
        signup.style.display = "block";
        pregame.style.display = "none";
    }
    if (gamePhase == 1){ //waiting for other players
        signup.style.display = "none";
        pregame.style.display = "block"; 
        text.style.display = "none"; 
    }
}



function roomDoesNotExist(){
    text.innerHTML = 'Room does not exist'; 
}

function deleteOldDoc(){
    db.collection(localStorage.getItem("room")).doc(localStorage.getItem("name")).get().then((doc) => {
        if (doc.exists) {
            number = doc.data().PlayerNumber;
            console.log("I am player " + number)

            db.collection(localStorage.getItem("room")).doc(localStorage.getItem("name")).delete().then(() => {
                console.log("Document successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });

        } else {
            console.log("Player unfound"); //lobby manager
        }
    }).catch((error) => {
        console.log("Player can't be found:", error);
    });
}

//sets screen to default
updateGamePhase(0);

form.collectionName.value = localStorage.getItem("room");
form.username.value = localStorage.getItem("name");


form.addEventListener('submit', e => {
    e.preventDefault(); //prevents the page from reloading
    

    // console.log(form.collectionName.value);
    // console.log(form.username.value);
    // console.log(form.response.value);
    localStorage.setItem("name", form.username.value)

    const player = {
        username: form.username.value,
        //response: form.response.value
    };

    //checking ig the room exists before adding the player
    db.collection("gameManager").doc("manager").get().then((doc) => {
        if (doc.exists) {
            lobbies = doc.data().currentLobbies;
            lobbies.forEach(lobby => { 
                console.log(lobby);
                if (form.collectionName.value == lobby)
                {
                    db.collection(form.collectionName.value).doc(form.username.value).set(player).then(() => {
                        console.log('user added');
                        text.innerHTML = 'user added';
                        localStorage.setItem("room", form.collectionName.value)
                        updateGamePhase(1);
                        setTimeout(deleteOldDoc, 5000);
                        return;
                    }).catch(err => {
                        console.log(err);
                    });
                } else {
                    
                };
            });
            
        } else {
            // doc.data() will be undefined in this case
            console.log("Manager unfound"); //lobby manager
        }
        }).catch((error) => {
            console.log("Manager can't be found:", error);
    });

    if(roomCode == 'ABCD')
    {
        //console.log('This room does not exist');
        setTimeout(roomDoesNotExist, 1000);
        
    }


});



// button.addEventListener('click', e => {
//     console.log('button clicked');

//     // updating elements in an array using a button
//     // washingtonRef.update({
//     //     regions: firebase.firestore.FieldValue.arrayUnion("east_coast")
//     // });

//     db.collection("cities").doc("SF").get().then((doc) => {
//         if (doc.exists) {
//             console.log("Document data:", doc.data());

//             //updating the html
//             //  let html = `
//             //  <div>
//             //     <p>${form.username.value}</p>
//             //  </div>
//             //  `;

//              let html = `
//              <div>
//                 <p>${doc.data().opinion}</p>
//              </div>
//              `;

//             html = `
//              <div>
//                 <p>${localStorage.getItem("name")}</p>
//              </div>
//              `;

//              //make this += to append to the query selector rather than replace
//             text.innerHTML = html;
//         } else {
//             // doc.data() will be undefined in this case
//             console.log("No such document!");
//         }
//         }).catch((error) => {
//             console.log("Error getting document:", error);
//     });


// });


// real-time listener on JUST documents and not attributes
// db.collection('cities').onSnapshot(snapshot => {
//     snapshot.docChanges().forEach(change => {
//       const doc = change.doc;
//       if(change.type === 'added'){
//         console.log("data added");
//         console.log(doc.data());
//       } else if (change.type === 'removed'){
//         console.log("data rmoeved");
//         console.log(doc.data());
//       }
//     });
//   });


//   <button type="button" id="button" name="button">Click Me!</button>

//   // display all the buttons as regions in real time
//   db.collection("cities").doc("SF")
//     .onSnapshot((doc) => {
//         console.log("Current data: ", doc.data());
//         regions = doc.data().regions;
        

//         var html = '';
//         console.log(regions);
//         regions.forEach(region => {
//             html += `
//              <div>
//                 <button type="button" id="button" name="button">${region}</button>
//              </div>
//              `;
//              //make this += to append to the query selector rather than replace
//         });

//         buttons.innerHTML = html;
        
//     });

