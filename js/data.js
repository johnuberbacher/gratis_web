firebase.initializeApp(firebaseConfig);
let db = firebase.firestore()
new Vue({
  el: '#app',
  data: {
    locations: [],
    reviews: [],
    users: [],
    inputLocationName: null,
    inputLocationCity: null,
    inputLocationCountry: null,
    inputLocationSummary: null,
    inputLocationBackdropPath: null,
    inputReviewUser: null,
    inputReviewBody: null,
    inputReviewLocation: null,
    selectedLocation: '',
    selectedRoute: '',
  },
  methods: {
    clearModals(){
        $('.modal').modal('hide')
        $('.modal .form').reset();
    },
    add() {
      return db.collection("users")
        .add({ firstName: coords_val, })
        .then(refDoc => {
          this.fetch()
        })
    },
    fetchUsers() {
    console.log("Fetching Users");
      return db.collection("users")
        .orderBy('firstName')
        .get()
        .then(querySnapshot =>
          querySnapshot.docs.map(doc => {
            let data = doc.data()
            return {
              id: doc.id,
              firstName: data.firstName,
              lastName: data.lastName,
              fullName: data.fullName,
            }
          })
         )
        .then(users => this.users = users)
    },
    fetchReviews() {
    return db.collection("reviews")
    .orderBy('reviewUser')
    .get()
    .then(querySnapshot =>
      querySnapshot.docs.map(doc => {
         console.log("Fetching Reviews");
        let data = doc.data()
        return {
          id: doc.id,
          reviewUser: data.reviewUser,
          reviewBody: data.reviewBody,
          reviewLocation: data.reviewLocation,
          created: data.created,
        }
      })
     )
    .then(reviews => this.reviews = reviews)
    },
    addReview() {
      return db.collection('reviews')
        .add({ reviewUser: this.inputReviewUser, reviewBody: this.inputReviewBody , reviewLocation: this.inputReviewLocation, created: firebase.firestore.FieldValue.serverTimestamp()})
        .then(() => {
          alert(`New Review Saved: review by ${this.inputReviewUser} for ${this.inputReviewLocation}`)
          this.clearModals()
          this.fetchReviews()
        })
    },
    updateReview(review) {
      return db.collection('reviews').doc(review.id)
        .set({ reviewUser: review.reviewUser, reviewBody: review.reviewBody , reviewLocation: review.reviewLocation })
        .then(() => {
          alert(`Updated Review: ${review.reviewLocation} - &{review.reviewUser} - ${review.id}`)
          this.clearModals()
          this.fetchReviews()
        })
    },
    deleteReview(id) {
      var txt;
      var accept = confirm("You are about to delete this record, are you sure?");
      if (accept == true) {
          return db.collection('reviews').doc(id)
            .delete()
            .then(() => {
              return this.fetchLocations()
            })
      }
    },
    fetchLocations() {
    console.log("Fetching Locations");
      return db.collection("locations")
        .orderBy('locationName')
        .get()
        .then(querySnapshot =>
          querySnapshot.docs.map(doc => {
            let data = doc.data()
            return {
              id: doc.id,
              locationName: data.locationName,
              summary: data.summary,
              rateUSD: data.rateUSD,
              city: data.city,
              country: data.country,
              backdropPath: data.backdropPath,
              created: data.created,
            }
          })
         )
        .then(locations => this.locations = locations)
    },
    addLocation() {
      return db.collection('locations').add({  locationName: this.inputLocationName, created: firebase.firestore.FieldValue.serverTimestamp(), locationName: this.inputLocationName, city: this.inputLocationCity , country: this.inputLocationCountry, backdropPath: this.inputLocationBackdropPath, summary: this.inputLocationSummary})
        .then(() => {
          alert(`New Location Saved: ${this.inputLocationName} - ${this.inputLocationCity}, ${this.inputLocationCountry}`)
          this.clearModals()
          this.fetchLocations()
        })
    },
    updateLocation(location) {
      return db.collection('locations').doc(location.id)
        .set({ locationName: location.locationName, city: location.city , country: location.country, backdropPath: location.backdropPath, rateUSD: location.rateUSD, summary: location.summary})
        .then(() => {
          alert(`Updated Location:  ${location.locationName} - ${location.id}`)
          return this.fetchLocations()
        })
    },
    deleteLocation(id) {
      var txt;
      var accept = confirm("You are about to delete this record, are you sure?");
      if (accept == true) {
          return db.collection('locations').doc(id)
            .delete()
            .then(() => {
              return this.fetchLocations()
            })
      }
    },

  },
  created() {
    this.fetchLocations();
    this.fetchUsers();
    this.fetchReviews();
  },
})

async function sample() {
    await delay(4000);
    console.log("This is the delay")
    //document.getElementById('send_id').click();
}
sample();

async function delay(delayInms) {
  return new Promise(resolve  => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}