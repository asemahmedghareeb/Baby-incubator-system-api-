const reservationForm = document.forms.reservationForm;
const submitBtn = reservationForm.elements.submit;
const status = 'pending';
const babyName = reservationForm.elements.babyName;
const babyAge = reservationForm.elements.babyAge;
const babyGender = reservationForm.elements.babyGender;
const babyWeight = reservationForm.elements.babyWeight;
const birthHospital = reservationForm.elements.birthHospital;
const birthDoctorName = reservationForm.elements.birthDoctorName;
const birthDoctorPhone = reservationForm.elements.birthDoctorPhone;
const hospitalId = reservationForm.elements.hospitalId;

const getURL = () => {
  const api_domain = window.location.host;
  let protocol
  if (api_domain.split(':')[0] === 'localhost') {
    protocol = 'http';
  } else {
    protocol = 'https';
  }
  return `${protocol}://${api_domain}`;
}

console.log(getURL());

const postJSON = async (data) => {
  try {
    const response = await fetch(
      `${getURL()}/reservations`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('userAuthToken'),
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    if (result.error) {
      throw new Error(result.error.message);
    }

    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

const submit = async (e) => {
  e.preventDefault();
  const formData = {
    status,
    babyName: babyName.value,
    babyAge: babyAge.value,
    babyGender: babyGender.value,
    babyWeight: babyWeight.value,
    birthHospital: birthHospital.value,
    birthDoctorName: birthDoctorName.value,
    birthDoctorPhone: birthDoctorPhone.value,
    hospitalId: hospitalId.value,
  }
  await postJSON(formData);
}

submitBtn.addEventListener('click', submit);
