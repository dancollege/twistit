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

const form = document.querySelector('.signup');
const button = document.querySelector('button');
// you can take a query selector of a specific class
const text = document.querySelector(".output");

const buttons = document.querySelector(".buttons");

const first = document.querySelector(".option1");
const second = document.querySelector(".option2");


const response = document.querySelector('.responsesubmit');


let roomCode = 'ABCD';
let gamePhase = 0; //0 will be home screen, 1 can be waiting for players, 2 will be answer submission, 1 will be waiting for players, 3 will be voting
let myPrompts = []; 
let allPrompts = [];
let allResponses = [];
let myNumber = 0;


var fullTurnOrder; //good thing this is here as can be reused for collecting responses

var signup = document.getElementById("signup");
var waiting = document.getElementById("waiting");
var answer = document.getElementById("answersubmission");
var voting = document.getElementById("voting");



//navbar elements
var navbar = document.getElementById("navbar");
var navbarCode = document.getElementById("code");
var navbarName = document.getElementById("name");
var navbarNumber = document.getElementById("number");

var funnymsg = document.getElementById("funnymessage");
var promptText = document.getElementById("submittingPrompt");
var votingPromptText = document.getElementById("votingPrompt");


const aftersubmission = ["Y'know the goal is to be funny, right?",
    "Not sure if I would have answered like that, but sure", 
    "It was a bold move writing that", 
    "You do realise other players are going to see what you just wrote?",
    "To be fair that last one was kind of funny",
    "Maybe pass the phone to someone else",
    "Shoulda put 'my mate dave' for that last one",
    "Taking your time eh?",
    "Your shoelace is untied",
    "Your parents are talking about you right now",
    "I know your phone passcode",
    "Found a book you might like: How to grow a sense of humour",
    "Cards against who?",
    "Car Hoot?",
    "Quick Lash?",
    "Quiz ease?",
    "You are the reason this game might get banned",
    "Did you even pass GCSE english",
    "It's quality over quantity btw",
    "I might copy that response actually",
    "That was really funny...",
    "Your phone screen is dirty"];

const aftervote = ["You sure you voted for the right option?",
    "Thanks for voting I guess...",
    "If only people voted like this in elections",
    "Hard choice?",
    "Funny stuff",
    "Hurry up a bit next time pls",
    "DEMOCRACY!",
    "THE POWER OF VOTING!",
    "I was going to vote that one too!",
    "You don't get a prize for being the slowest to vote btw",
    "These responses are a LOT funnier than yours..."];

const pregame = ["Well this is exciting, isn't it?",
    "Is this your first time playing?",
    "DO NOT play this game.",
    "Time to get your funny on",
    "This game is nothing like 'Deal or No Deal'",
    "Maybe ask the person next to you if you don't know how to play",
    "Getting bored already?",
    "Tell people to HURRY UPPP",
    "Fingertips are reccomended",
    "I heard the winner gets bragging rights",
    "Genuine advice: maybe don't keep refreshing the game",
    "Are you looking forward to embarrassing yourself?",
    "Click the twist-it logo and something cool might happen",
    "There is no joke here, I ran out of time"
]

let responseString = '';
//let promptToBeVotedOn = '';
let targetResponses = 2; //how many responses the player will need, constant
let currentResponse = 1;
var promptsLeft = document.getElementById("promptsLeft");

let votedfor = 0;

let submittedThisRound = true;
//let number = '';

let currentlyAnswering = 1;

function updateGamePhase(phase){
    gamePhase = phase;
    if (gamePhase == 0){ //player enter details
        signup.style.display = "block";
        waiting.style.display = "none";
        navbar.style.display = "none";

        answer.style.display = "none";

        voting.style.display = "none";
    }
    if (gamePhase == 1){ //waiting for other players
        signup.style.display = "none";
        waiting.style.display = "block"; 
        text.style.display = "none"; 
        navbar.style.display = "block";

        answer.style.display = "none";

        voting.style.display = "none";
    }
    if (gamePhase == 2){ //answer submission
        signup.style.display = "none";
        waiting.style.display = "none"; 
        text.style.display = "none"; 
        navbar.style.display = "block";
        answer.style.display = "block";

        promptsLeft.innerHTML = (currentResponse + "/" + targetResponses);
    }
    if (gamePhase == 3){ //vote submission
        signup.style.display = "none";
        waiting.style.display = "none"; 
        text.style.display = "none"; 
        navbar.style.display = "block";
        answer.style.display = "none";
        voting.style.display = "block";

    }
}

function newRealtimeListener() //basically reconnecting
{
    //add code for detatching listeners here, none ye
    //unsubscribe();
    //roomCode = form.collectionName.value;
    roomCode = localStorage.getItem("room")
    
    myNumber = localStorage.getItem("playerNumber")

    var unsubscribe = db.collection(roomCode).doc("lobby controller").onSnapshot((doc) => {
        console.log("subbed to game controller and change made");
        allPrompts = doc.data().Prompts;
        if(doc.data().GamePhase == 1){
            allPrompts = doc.data().Prompts;
            // var leftTurnOrder = doc.data().TurnOrderLeft; // reference to seperate turn orders removed
            // var rightTurnOrder = doc.data().TurnOrderRight; // reference to seperate turn orders removed
            fullTurnOrder = doc.data().TurnOrderFull;

            console.log(allPrompts);


            // console.log(leftTurnOrder);
            // console.log(rightTurnOrder);
            setTimeout(getMyPrompts, 2000);
        }
        if(doc.data().GamePhase == 2){
            //submissions ended
            updateGamePhase(1);
        }
        if(doc.data().GamePhase == 3){ // for now 3 is going to be voting but might change
            allResponses = doc.data().Responses;
            //localStorage.setItem("votingOn",0);
            if (localStorage.getItem("lastVotedOn") == doc.data().CurrentlyVotingOnPairing){
                console.log("already voted")
                funnymsg.innerHTML = aftervote[Math.floor(Math.random()*aftervote.length)];
                
                updateGamePhase(1);
            } else
            {
                updateGamePhase(3);
                if(doc.data().CurrentlyVotingOnPairing != localStorage.getItem("votingOn")){
                    localStorage.setItem("votingOn",doc.data().CurrentlyVotingOnPairing);
                }
                refreshVotes();
            }
        }
    });
}


function getMyPrompts(){
    //myNumber = 1;
    let i = 1;
    //console.log(allPrompts);
    fullTurnOrder.forEach(num => {
        // console.log(num);
        // console.log("my number is" + myNumber);
        
        if (parseInt(myNumber) == parseInt(num)){
            console.log("thats my number!");
            //I shouldn't be using num here but instead i
            myPrompts.push(allPrompts[Math.ceil(parseInt(i)/2)-1]);
            //myPrompts.push(allPrompts[0]);
            //console.log(myPrompts);
        }
        i++;
    });
    console.log(myPrompts);
    targetResponses = myPrompts.length;
    if(localStorage.getItem("currentlyAnswering") < 2)
    {
        localStorage.setItem("currentlyAnswering",1); 
        currentResponse = 1;
    }
    else
    {
        currentResponse = localStorage.getItem("currentlyAnswering");
    }

    if(currentResponse != 100 && gamePhase != 3)
    {
        promptText.innerHTML = myPrompts[currentResponse - 1];
        promptsLeft.innerHTML = (currentResponse + "/" + targetResponses);
        updateGamePhase(2);
    }

}

//voting
function refreshVotes(){
    //localStorage.getItem("votingOn")
    updateGamePhase(3);
    

    //the prompt will just be equal to the number being voted on
    var promptToBeVotedOn = allPrompts[localStorage.getItem("votingOn")-1];
    //the responses will be at the ceiling og the index of voting on
    var response1 = allResponses[(localStorage.getItem("votingOn")*2)-2];
    var response2 = allResponses[(localStorage.getItem("votingOn")*2)-1];

    console.log("Prompt to be voted on: ", promptToBeVotedOn, response1, response2);

    votingPromptText.innerHTML = promptToBeVotedOn;
    first.innerHTML = response1;
    second.innerHTML = response2;
}

//vote buttons
first.addEventListener('click', e => {
    console.log('button clicked');
    //console.log(e.srcElement.id);
    justVoted(1);
    var controllerRef = db.collection(localStorage.getItem("room")).doc("lobby controller");
    controllerRef.update({
        VotesFor1: firebase.firestore.FieldValue.arrayUnion(localStorage.getItem("playerNumber")) //at this point I realised, it might be easier to add to an array incase in the time I am reading then writing the data someone else votes, also means I could show players who voted for each other as a post dev feature.
    });
});

second.addEventListener('click', e => {
    console.log('button clicked');
    justVoted(2);
    //console.log(e.srcElement.id);
    var controllerRef = db.collection(localStorage.getItem("room")).doc("lobby controller");
    controllerRef.update({
        VotesFor2: firebase.firestore.FieldValue.arrayUnion(localStorage.getItem("playerNumber")) //at this point I realised, it might be easier to add to an array incase in the time I am reading then writing the data someone else votes, also means I could show players who voted for each other as a post dev feature.
    });
});

function justVoted(number){
    localStorage.setItem("lastVotedOn",localStorage.getItem("votingOn"));

    console.log(number);
    funnymsg.innerHTML = aftervote[Math.floor(Math.random()*aftervote.length)];
    updateGamePhase(1);
    // var playerRef = db.collection(localStorage.getItem("room")).doc((0 + localStorage.getItem("playerNumber")).slice(-2));
    // playerRef.update({
    //     VotedFor: number
    // });


}




function roomDoesNotExist(){
    text.innerHTML = 'Room does not exist'; 
}

function deleteOldDoc(){
    db.collection(localStorage.getItem("room")).doc(localStorage.getItem("name")).get().then((doc) => {
        if (doc.exists) {
            //number = doc.data().PlayerNumber;
            localStorage.setItem("playerNumber",doc.data().PlayerNumber);

            myNumber = doc.data().PlayerNumber;
            navbarNumber.innerHTML = myNumber;
            console.log("I am player " + myNumber)

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
funnymsg.innerHTML = pregame[Math.floor(Math.random()*pregame.length)];

updateGamePhase(0);

form.collectionName.value = localStorage.getItem("room");
form.username.value = localStorage.getItem("name");

//funnymsg.innerHTML = aftersubmission[Math.floor(Math.random()*aftersubmission.length)];


form.addEventListener('submit', e => {
    e.preventDefault(); //prevents the page from reloading
    

    // console.log(form.collectionName.value);
    // console.log(form.username.value);
    // console.log(form.response.value);
    

    const player = {
        username: form.username.value,
        //response: form.response.value
    };

    console.log(form.username.value);

    //checking ig the room exists before adding the player
    db.collection("gameManager").doc("manager").get().then((doc) => {
        if (doc.exists) {
            lobbies = doc.data().currentLobbies;
            lobbies.forEach(lobby => { 
                console.log(lobby);
                if (form.collectionName.value == lobby)
                {
                    if(form.collectionName.value == localStorage.getItem("room"))
                    {
                        console.log('user rejoined');

                        text.innerHTML = 'Rejoining...'; 
                        //roomCode = form.collectionName.value;

                        if (localStorage.getItem("currentlyAnswering") != 100)
                        {
                            currentResponse = localStorage.getItem("currentlyAnswering");
                            //updateGamePhase(2);
                        } else
                        {
                            funnymsg.innerHTML = aftersubmission[Math.floor(Math.random()*aftersubmission.length)];
                            updateGamePhase(1); //this will update to whatever phase the game is at the time, but for now this will be one
                        }

                        navbarCode.innerHTML = localStorage.getItem("room");
                        navbarName.innerHTML = localStorage.getItem("name");
                        navbarNumber.innerHTML = localStorage.getItem("playerNumber");

                        newRealtimeListener();

                    } else{ //this prevents a new player from being made, and instead allows a player to rejoin
                        db.collection(form.collectionName.value).doc(form.username.value).set(player).then(() => {
                            console.log('user added');
                            text.innerHTML = 'user added';
                            localStorage.setItem("room", form.collectionName.value)
                            localStorage.setItem("name", form.username.value)
                            
                            newRealtimeListener();
                            
                            
                            
                            localStorage.setItem("currentlyAnswering",0); 
                            navbarCode.innerHTML = form.collectionName.value;
                            navbarName.innerHTML = form.username.value;

                            updateGamePhase(1); //gamephase 1
                            setTimeout(deleteOldDoc, 5000);
                            return;
                        }).catch(err => {
                            console.log(err);
                        });
                    }
                    
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
        setTimeout(roomDoesNotExist, 3000);
    }


});



response.addEventListener('submit', e => {
    e.preventDefault(); //prevents the page from reloading

    //console.log("response submitted");
    responseString = response.response.value;
    console.log(responseString);

    var playerRef = db.collection(localStorage.getItem("room")).doc((0 + localStorage.getItem("playerNumber")).slice(-2));
    //var playerRef = db.collection("1234").doc("01");

    // Atomically add a new region to the "regions" array field.
    // playerRef.update({
    //     Responses: firebase.firestore.FieldValue.arrayUnion(response.response.value)
    // });
    playerRef.update({
        Responses: response.response.value
    });



    currentResponse++;
    localStorage.setItem("currentlyAnswering",currentResponse); 
    response.response.value = "";

    promptsLeft.innerHTML = (currentResponse + "/" + targetResponses);
    promptText.innerHTML = myPrompts[currentResponse - 1];


    if (currentResponse > targetResponses)
    {
        funnymsg.innerHTML = aftersubmission[Math.floor(Math.random()*aftersubmission.length)];
        updateGamePhase(1);
        localStorage.setItem("currentlyAnswering",100); //currently answering 100 will mean player has submitted, as there will never be 100 prompts
        //submittedThisRound = true;
    }


    //submit to the right currently answering

    if (currentlyAnswering == 1){

    }
    else if (currentlyAnswering == 2){

    }
    else if (currentlyAnswering == 3){

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


//real-time listener on JUST documents and not attributes
// db.collection(roomCode).doc('lobby controller').onSnapshot(snapshot => {
//     snapshot.docChanges().forEach(change => {
//       const doc = change.doc;
//       if(change.type === 'added'){
//         console.log("data added");
//         console.log(doc.data());
//       } else if (change.type === 'removed'){
//         console.log("data rmoeved");
//         console.log(doc.data());
//       } else if (change.type === 'modified'){
//         console.log("data modified");
//         console.log(doc.data());
//     }});
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

