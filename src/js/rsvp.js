function resetForm() {
  document.getElementById('submit-button').setAttribute('disabled', true);
  document.getElementById('plusonegroup').classList.add('hidden-form');
  document.getElementById('fallbackguest').classList.add('hidden-form');
}

function cantFindMyself() {
  resetForm();

  document.getElementById('fallbackguest').classList.remove('hidden-form');
  document.getElementById('submit-button').removeAttribute('disabled');
  document.getElementById('plusonegroup').classList.remove('hidden-form');
}

function guestSelected(indx) {
  resetForm();

  let guest = window.guestlist.guests[indx];

  if (guest.hasPlusOne) {
    document.getElementById('plusonegroup').classList.remove('hidden-form');
  }

  document.getElementById('submit-button').removeAttribute('disabled');
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