// var docRef = db.collection("cities").doc("SF");

// // get data if it exists
// docRef.get().then((doc) => {
//     if (doc.exists) {
//         console.log("Document data:", doc.data());
//     } else {
//         // doc.data() will be undefined in this case
//         console.log("No such document!");
//     }
// }).catch((error) => {
//     console.log("Error getting document:", error);
// });



// You can listen to a document with the onSnapshot() method. 
// An initial call using the callback you provide creates a document snapshot
// immediately with the current contents of the single document.
// Then, each time the contents change, another call updates the document snapshot.
db.collection("cities").doc("SF")
    .onSnapshot((doc) => {
        console.log("Current data: ", doc.data());
    });


// Listen to multiple documents in a collection    
// db.collection("cities").where("state", "==", "CA")
//     .onSnapshot((querySnapshot) => {
//         var cities = [];
//         querySnapshot.forEach((doc) => {
//             cities.push(doc.data().name);
//         });
//         console.log("Current cities in CA: ", cities.join(", "));
//     });

// class City {
//     constructor (name, state, country ) {
//         this.name = name;
//         this.state = state;
//         this.country = country;
//     }
//     toString() {
//         return this.name + ', ' + this.state + ', ' + this.country;
//     }
// }

// // Firestore data converter
// var cityConverter = {
//     toFirestore: function(city) {
//         return {
//             name: city.name,
//             state: city.state,
//             country: city.country
//             };
//     },
//     fromFirestore: function(snapshot, options){
//         const data = snapshot.data(options);
//         return new City(data.name, data.state, data.country);
//     }
// };





// get  multiple documents from a collection

// db.collection("cities").where("capital", "==", true)
//     .get()
//     .then((querySnapshot) => {       
//         querySnapshot.forEach((doc) => {
//             // doc.data() is never undefined for query doc snapshots
//             console.log(doc.id, " => ", doc.data());
//         });
//     })
//     .catch((error) => {
//         console.log("Error getting documents: ", error);
//     });