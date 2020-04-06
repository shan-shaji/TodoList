exports.getDate = function() {
  const today = new Date();
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric"
  };
  const givenDay = today.toLocaleString("en-US", options);

  return givenDay;
}

// module.exports is also possible

exports.getDay =  () => {   // possible syntax of function
  const today = new Date();
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric"
  };
  const givenDay = today.toLocaleString("en-US", options);

  return givenDay;
}

function getDay() {
  let today = new Date();
  let options = {
    weekday: "long"
  };
  let givenDay = today.toLocaleString("en-US", options);

  return givenDay;
}
