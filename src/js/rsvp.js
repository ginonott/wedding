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

function disablePlusOneCB() {
  document.getElementById('accept-plus-one').setAttribute('disabled', true);
}

function enablePlusOneCB() {
  document.getElementById('accept-plus-one').removeAttribute('disabled');
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

function getPartyRsvp() {
  return document.getElementById('party_rsvp').value;
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

  enableSubmitButton();
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

function clearErrorMessage() {
  document.getElementById('error-message').innerHTML = '';
}

function showSuccessMessage(msg) {
  let successSpan = document.getElementById('success-message');
  successSpan.classList.remove('hidden');
  successSpan.innerHTML = msg;
}

function noSelected() {
  document.getElementById('song-requests').setAttribute('disabled', true);
  document.getElementById('diet-restrictions').setAttribute('disabled', true);
  document.getElementById('party_rsvp').setAttribute('disabled', true);
  disablePlusOneField();
  disablePlusOneCB();
}

function yesSelected() {
  document.getElementById('song-requests').removeAttribute('disabled');
  document.getElementById('diet-restrictions').removeAttribute('disabled');
  document.getElementById('party_rsvp').removeAttribute('disabled');
  enablePlusOneField();
  enablePlusOneCB();
}

function isAttending() {
  let yesBox = document.getElementById('yes');

  return yesBox.checked;
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
  clearErrorMessage();
  showSpinner();
  disableSubmitButton();

  try {
    let guest = getGuest();
    guest.bringingPlusOne = false;
    guest.plusOneName = "";
    guest.diet = getDietRestrictions();
    guest.songReq = getSongRequests();
    guest.rsvped = new Date().toDateString();
    guest.attending = isAttending() ? 'yes' : 'no';
    guest.partyRsvp = getPartyRsvp();

    if (guest.hasPlusOne) {
      let plusOne = getPlusOne();
      if (plusOne) {
        guest.bringingPlusOne = true;
        guest.plusOneName = plusOne;
      }
    }

    db.collection('rsvp_list')
      .doc(`${guest.name} - ${new Date().toUTCString()}`)
      .set(guest)
      .then(success => {
        hideSpinner();
        if (isAttending()) {
          showSuccessMessage("🎉 You're all set! We can't wait to see you on the big day! 🎉");
        } else {
          showSuccessMessage("We're sorry you can't make it! We hope to see you soon as the newly wed Notto family.");
        }
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
  if (e.target.checked) {
    plusOneAccepted();
  } else {
    plusOneDeclined();
  }
});

document.getElementById('yes').addEventListener('change', e => {
  yesSelected();
});

document.getElementById('no').addEventListener('change', e => {
  noSelected();
});