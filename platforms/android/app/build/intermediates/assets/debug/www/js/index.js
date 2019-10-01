$(document).ready(function () {

    const deviceReady = new Promise((resolve => {
        document.addEventListener("deviceready", resolve, false);
    }));

    const pageCreate = new Promise((resolve) => {
        document.addEventListener("pagecreate", resolve, false);
    });

    Promise.all([pageCreate, deviceReady]);

    var config = {
        apiKey: "AIzaSyCqbfb9IxPEYWRGuJMVvc-Cb8VEecctIXI",
        databaseURL: "https://medical-manager-2db66.firebaseio.com/",
        projectId: "medical-manager-2db66",
        storageBucket: "medical-manager-2db66.appspot.com",
        messagingSenderId: "214944964114"
    };
    firebase.initializeApp(config);

    var database = firebase.database().ref();

    var $name = $("#name");
    var $OHIP = $("#OHIP");
    var $email = $("#email");
    var $address = $("#address");
    var $city = $("#city");
    var $phoneNo = $("#phoneNo");
    var $location = $("#location");
    var $date = $("#date");
    var $time = $("#time");
    var $note = $("#note");
    var $listviewappts = $("#listviewappts");
    var $form = $("#patientForm");
    var $clinicSearch = $("#clinicSearch");
    var $pop = $("#pop");
    var db, openRequest;
    var xhr = new XMLHttpRequest();
    var url = "https://medical-manager-2db66.firebaseio.com/.json";

    var click_event = $.support.touch ? "tap" : "click";

    var dbSupported = ("indexedDB" in window) ? true : false;

    if (dbSupported) {
        openRequest = window.indexedDB.open("locationDB", 1);

        openRequest.onupgradeneeded = function () {
            db = openRequest.result;
            if (!db.objectStoreNames.contains("location")) {
                db.createObjectStore("location", {keyPath: "locationName"});
            }
        };
        openRequest.onsuccess = function () {
            db = openRequest.result;
            var location = {
                locationName: 'Mayo Clinic',
                doctors: 2,
                allottedTime: 10,
            };

            var transaction = db.transaction(["location"], "readwrite");

            transaction.objectStore("location").put(location);
        };

        openRequest.onerror = function (event) {
            console.log("DB error");
            console.dir(event);
        };

    }


    $("#createAppointment").on(click_event, function () {

        var name = $name.val().trim();
        var OHIP = $OHIP.val().trim();
        var email = $email.val().trim();
        var address = $address.val().trim();
        var city = $city.val().trim();
        var phoneNo = $phoneNo.val().trim();
        var location = $location.val().trim();
        var inputDate = new Date($date.val());
        var day = inputDate.getDate() + 1;
        var month = inputDate.getMonth() + 1;
        var monthString = "";
        var year = inputDate.getFullYear();
        var time = $time.val().trim();
        var note = $note.val().trim();


        switch (month) {
            case 1:
                monthString += "January";
                break;
            case 2:
                monthString += "February";
                break;
            case 3:
                monthString += "March";
                break;
            case 4:
                monthString += "April";
                break;
            case 5:
                monthString += "May";
                break;
            case 6:
                monthString += "June";
                break;
            case 7:
                monthString += "July";
                break;
            case 8:
                monthString += "August";
                break;
            case 9:
                monthString += "September";
                break;
            case 10:
                monthString += "October";
                break;
            case 11:
                monthString += "November";
                break;
            case 12:
                monthString += "December";
                break;

        }

        $("#nameError").css("display", "none");
        $("#OHIPError").css("display", "none");
        $("#OHIPinvalid").css("display", "none");
        OHIP = parseInt($OHIP.val().trim());
        $("#emailError").css("display", "none");
        $("#addressError").css("display", "none");
        $("#cityError").css("display", "none");
        $("#phoneNoError").css("display", "none");
        $("#phoneNoInvalid").css("display", "none");
        phoneNo = parseInt($phoneNo.val().trim());
        $("#locationError").css("display", "none");
        $("#dateError").css("display", "none");

        var date = monthString + " " + day + ", " + year;

        var data = null;

         if (name.length < 1 || OHIP.length < 1 || isNaN(parseInt(OHIP)) || email.length < 1 || address.length < 1 || city.length < 1 || phoneNo.length < 1 || isNaN(parseInt(phoneNo)) || location.length < 1 || inputDate == "Invalid Date" || time == "") {
             if (name.length < 1) {
                 $("#nameError").text("Name cannot be empty").css("display","inline");
             } else {
                 $("#nameError").css("display", "none");
             }

             if (OHIP.length < 1) {
                 $("#OHIPerror").text("OHIP cannot be empty").css("display", "inline");
             } else if (isNaN(parseInt(OHIP))) {
                 $("#OHIPerror").css("display", "none");
                 $("#OHIPinvalid").text("OHIP is not valid").css("display", "inline");
             } else {
                 $("#OHIPinvalid").css("display", "none");
             }

             if (email.length < 1) {
                 $("#emailError").text("Email cannot be empty").css("display", "inline");
             } else {
                 $("#emailError").css("display", "none");
             }

             if (address.length < 1) {
                 $("#addressError").text("Address cannot be empty").css("display", "inline");
             } else {
                 $("#addressError").css("display", "none");
             }

             if (city.length < 1) {
                 $("#cityError").text("City cannot be empty").css("display", "inline");
             } else {
                 $("#cityError").css("display", "none");
             }

             if (phoneNo.length < 1) {
                 $("#phoneNoError").text("Phone number cannot be empty").css("display", "inline");
             } else if (isNaN(parseInt(phoneNo))) {
                 $("#phoneNoError").css("display", "none");
                 $("#phoneNoInvalid").text("Phone number is not valid").css("display", "inline");
             } else {
                 $("#phoneNoInvalid").css("display", "none");
             }

             if (location.length < 1) {
                 $("#locationError").text("Location cannot be empty").css("display","inline");
             } else {
                 $("#locationError").css("display", "none");
             }

             if (inputDate == "Invalid Date") {
                 $("#dateError").text("Invalid date").css("display", "inline");
             } else {
                 $("#dateError").css("display", "none");
             }
             if (time == "") {
                 $("#timeError").text("Invalid time").css("display","inline");
             } else {
                 $("#timeError").css("display", "none");
             }
         }
         else {

             var patient = database.child("patient");

             xhr.onreadystatechange = function () {
                 if (this.readyState == XMLHttpRequest.DONE) {
                     if (this.status == 200) {
                         data = JSON.parse(this.responseText);
                         var patient = data.patient;

                         for (var key in patient) {
                             if (patient.hasOwnProperty(key)) {
                                 if (patient[key].location == location && patient[key].date == date && patient[key].time == time) {
                                     navigator.notification.alert(
                                         'Unable to book appointment. Please try a different time and/or date.',
                                         null,
                                         'Appointment Error',
                                         "OK"
                                     );
                                     break;
                                 }
                                 else {
                                     addPatient();
                                     break;
                                 }
                             }
                         }
                     }
                 }
             };
             xhr.open("GET", url, true);
             xhr.send();
            function addPatient() {
                patient.push({
                    name: name,
                    OHIP: OHIP,
                    email: email,
                    address: address,
                    city: city,
                    phoneNo: phoneNo,
                    location: location,
                    date: date,
                    time: time,
                    note: note
                });

                navigator.notification.alert(
                    'Patient appointment was successfully created!',
                    alertDismissed,
                    'Patient Appointment created',
                    'Done'
                );
            }
         }
    });

    $("#viewAllAppts").on(click_event, function () {
        var display = "";
        var data = null;

        xhr.onreadystatechange = function () {
            if (this.readyState == XMLHttpRequest.DONE) {

                if (this.status == 200) {
                    data = JSON.parse(this.responseText);
                    if (data == null) {
                        display += "<li style='margin-left: 15px'>No appointment data to display.</li>"
                        $listviewappts.html(display);
                    } else {
                        var patient = data.patient;

                        for (var key in patient) {
                            if (patient.hasOwnProperty(key)) {
                                display += "<li class='ui-li-has-alt ui-firstchild ui-last-child'>"
                                    + "<a class='ui-btn'>"
                                    + "<p class='key' style='display: none'>" + key + "</p>"
                                    + "<h1><strong>" + patient[key].date + " @ " + patient[key].time + "</strong></h1>"
                                    + "<p><strong>Name: </strong>" + patient[key].name + "</p>"
                                    + "<p><strong>Location: </strong>" + patient[key].location + "</p>"
                                    + "<p><strong>Reason for appointment: </strong>" + patient[key].note + "</p>"
                                    + "</a>"
                                    + "<a class='delete ui-btn ui-btn-icon-notext ui-icon-delete'></a>"
                                    + "</li>"
                            }
                        }
                        $listviewappts.html(display);
                        $(".delete").on("click", function () {
                            var listitem = $(this).parent("li");
                            var listitemdb = listitem[0];
                            database.child("patient").child(listitemdb.getElementsByClassName("key")[0].textContent).remove();
                            listitem.remove();
                        });
                    }
                } else {
                    alert("Error: Cannot get data");
                }
            }
        }
        ;
        xhr.open("GET", url, true);
        xhr.send();
    });

    $("#checkWaitTimes").on("click", function () {
        event.preventDefault();
        var locationName = $clinicSearch.val().trim();
        var display = "";

        var storeRequest = db.transaction(["location"], "readwrite").objectStore("location").get(locationName);

        storeRequest.onsuccess = function () {
            if (storeRequest.result == null) {
                display += "<p id='waittime'>" + "Location not found" + "</p>";
                $("#clinicInfo").html(display);
            } else {
                var doctors = storeRequest.result.doctors;
                var allotedTime = storeRequest.result.allottedTime;
                var waitTime = 0;
                var patientCounter = 0;
                var data = null;

                xhr.onreadystatechange = function () {
                    if (this.readyState == XMLHttpRequest.DONE) {

                        if (this.status == 200) {
                            data = JSON.parse(this.responseText);
                            if (data == null) {
                                display += "<p id='waittime'>" + "Estimated Wait Time: " + 0 + " mins" + "</p>";

                            } else {
                                var patient = data.patient;
                                for (var key in patient) {
                                    if (patient[key].location == locationName) {
                                        patientCounter++;
                                    }
                                }
                                if (patientCounter < doctors) {
                                    display += "<p id='waittime'>" + "Estimated Wait Time: " + 0 + " mins" + "</p>";
                                }
                                else {
                                    waitTime = (patientCounter - doctors) * allotedTime;
                                    display += "<p id='waittime'>" + "Estimated Wait Time: " + waitTime + " mins" + "</p>";
                                }
                            }
                        } else {
                            alert("Error: Cannot get data");
                        }
                        $("#clinicInfo").html(display);

                    }
                };
                xhr.open("GET", url, true);
                xhr.send();
            }

        };
    });

    function alertDismissed() {
        $form.trigger("reset");
    }
});






