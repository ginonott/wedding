// Initialize Firebase
var config = {
  apiKey: "AIzaSyCS2Z-x2uAfhAtwfSu9EbYtXQDDoDIYYRc",
  authDomain: "wedding-f4d61.firebaseapp.com",
  databaseURL: "https://wedding-f4d61.firebaseio.com",
  projectId: "wedding-f4d61",
  storageBucket: "wedding-f4d61.appspot.com",
  messagingSenderId: "692014919563"
};

firebase.initializeApp(config);

var db = firebase.firestore();

db.collection("rsvp_list")
  .get()
  .then(querySnapshot => {
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });
  });

function showSpinner() {
  document.getElementById('rsvp-loader').classList.remove('hidden');
}

function hideSpinner() {
  document.getElementById('rsvp-loader').classList.add('hidden');
}

function enableSubmitButton() {
  document.getElementById('submit-button').removeAttribute('disabled');
}

function disableSubmitButton() {
  document.getElementById('submit-button').setAttribute('disabled', true);
}

function disablePlusOneField() {
  let plusoneInput = document.getElementById('plusone');
  plusoneInput.setAttribute('disabled', true);
  plusoneInput.value = '';
}

function enablePlusOneField() {
  let plusoneInput = document.getElementById('plusone');
  plusoneInput.removeAttribute('disabled');
}

function resetForm() {
  disableSubmitButton();
  enablePlusOneField();
  document.getElementById('plusonegroup').classList.add('hidden');
  document.getElementById('fallbackguest').classList.add('hidden');
  document.getElementById('accept-plus-one').checked = false;
  document.getElementById('error-message').classList.add('hidden');
}

function getGuest() {
  let guestIndex = parseInt(document.getElementById('guestselect').value);

  if (guestIndex === -1) {
    throw new Error("You must select yourself from the dropdown list.");
  }

  if (guestIndex === -2) {
    let fallbackName = document.getElementById('fallback').value;

    if (fallbackName.trim().length < 1) {
      throw new Error("You didn't write your name down.");
    }

    return {
      name: fallbackName,
      hasPlusOne: true
    }
  }

  return window.guestlist.guests[guestIndex];
}

function getPlusOne() {
  if (document.getElementById('accept-plus-one').checked) {
    let plusOneName = document.getElementById('plusone').value;
    if (plusOneName.trim().length < 1) {
      throw new Error('You must enter your plus one\'s name!');
    }
    
    return plusOneName;
  } else {
    return null;
  }
}

function getSongRequests() {
  return document.getElementById('song-requests').value;
}

function getDietRestrictions() {
  return document.getElementById('diet-restrictions').value;
}

function cantFindMyself() {
  resetForm();

  document.getElementById('fallbackguest').classList.remove('hidden');
  document.getElementById('plusonegroup').classList.remove('hidden');
  enableSubmitButton();
}

function guestSelected(indx) {
  resetForm();

  let guest = window.guestlist.guests[indx];

  if (guest.hasPlusOne) {
    document.getElementById('plusonegroup').classList.remove('hidden');
    disablePlusOneField();
  }

  document.getElementById('submit-button').removeAttribute('disabled');
}

function plusOneAccepted() {
  enablePlusOneField();
}

function plusOneDeclined() {
  disablePlusOneField();
}

function showErrorMessage(msg) {
  let errSpan = document.getElementById('error-message');
    errSpan.classList.remove('hidden');
    errSpan.innerHTML = msg;
}

function showSuccessMessage(msg) {
  let successSpan = document.getElementById('success-message');
  successSpan.classList.remove('hidden');
  successSpan.innerHTML = msg;
}

document.getElementById('guestselect').addEventListener('change', e => {
  let indx = parseInt(e.target.value);
  if (indx === -2) {
    cantFindMyself();
  } else if (indx === -1) {
    resetForm();
  } else {
    guestSelected(indx);
  }
});

document.getElementById('submit-button').addEventListener('click', e => {
  showSpinner();
  disableSubmitButton();

  try {
    let guest = getGuest();
    guest.bringingPlusOne = false;
    guest.plusOneName = "";
    guest.diet = getDietRestrictions();
    guest.songReq = getSongRequests();

    if (guest.hasPlusOne) {
      let plusOne = getPlusOne();
      if (plusOne) {
        guest.bringingPlusOne = true;
        guest.plusOneName = plusOne;
      }
    }

    db.collection('rsvp_list')
      .doc(guest.name)
      .set(guest)
      .then(success => {
        hideSpinner();
        showSuccessMessage("🎉 You're all set! We can't wait to see you on the big day! 🎉");
      })
      .catch(err => {
        hideSpinner();
        enableSubmitButton();
        showErrorMessage(err.message);
      });


    console.log(guest);
  } catch (err) {
    hideSpinner();
    enableSubmitButton(); 
    showErrorMessage(err.message);
  }
});

document.getElementById('accept-plus-one').addEventListener('click', e => {
  if(e.target.checked) {
    plusOneAccepted();
  } else {
    plusOneDeclined();
  }
});