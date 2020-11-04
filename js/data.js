firebase.initializeApp(firebaseConfig);
let db = firebase.firestore()
new Vue({
  el: '#app',
  data: {
    locations: [],
    reviews: [],
    users: [],
    inputLocationName: '',
    inputLocationCity: '',
    inputLocationCountry: '',
    inputLocationSummary: '',
    inputLocationBackdropPath: '',
    selectedLocation: '',
    selectedRoute: '',
  },
  methods: {
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
        }
      })
     )
    .then(reviews => this.reviews = reviews)
    },
    addReview() {
      return db.collection('reviews')
        .add({ reviewUser: review.inputReviewUser, reviewBody: review.inputReviewBody , reviewLocation: review.inputReviewLocation})
        .then(() => {
          alert(`Added Review: review by ${review.inputReviewUser}`)
          this.fetchReviews()
        })
    },
    updateReview(review) {
      return db.collection('reviews').doc(review.id)
        .set({ reviewUser: review.reviewUser, reviewBody: review.reviewBody , reviewLocation: review.reviewLocation })
        .then(() => {
          alert(`Updated Review: ${review.reviewLocation} - &{review.reviewUser} - ${review.id}`)
          return this.fetchReviews()
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
              city: data.city,
              country: data.country,
              backdropPath: data.backdropPath,
            }
          })
         )
        .then(locations => this.locations = locations)
    },
    addLocation() {
      return db.collection('locations')
        .add({ locationName: location.inputLocationName, city: location.inputLocationCity , country: location.inputLocationCountry, backdropPath: location.inputLocationBackdropPath, summary: location.inputLocationSummary})
        .then(() => {
          alert(`Added location ${location.inputLocationName}`)
          this.fetchLocations()
        })
    },
    updateLocation(location) {
      return db.collection('locations').doc(location.id)
        .set({ locationName: location.locationName, city: location.city , country: location.country, backdropPath: location.backdropPath, summary: location.summary})
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