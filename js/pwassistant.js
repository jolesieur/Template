////////////////////////////////////////
// Début Script Menu Navigation
////////////////////////////////////////
$(".navbar-nav .nav-item").on("click", function () {
    $(".navbar-nav .nav-item").find(".active").removeClass("active");
});

$(".navbar-nav li a").on("click", function () {
    if (!$(this).hasClass("dropdown-toggle")) {
        $(".navbar-collapse").collapse("hide");
    }
});

// Set active sub-tab name to dropmenu text.
$(".sub-tab a").on("click", function () {
    $(this).closest("li").find("span").text($(this).text());
});

////////////////////////////////////////
// Fin Script Menu Navigation
////////////////////////////////////////

var dataSet = [];
var arr = null;
var table;
var currentRow = null;
var localisation = null;

// Function to be run when the page load.
$(document).ready(function () {
    $("#selectIntervention").focus();

    table = $('#example').DataTable({
        order: [0, 'desc'],
        stateSave: true,
        data: dataSet
    });

    $('#example tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            currentRow = null;
        } else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            currentRow = $(this).closest("tr");
        }
    });

    $(this).one('keydown', function (e) {
        if (e.keyCode == 17) {
            $(".btn-delete").removeAttr("disabled");
        }
    });

    $('#addPumpform input').keyup(function () {
        var empty = false;
        $('#addPumpform input').each(function () {
            if ($(this).val().length == 0) {
                empty = true;
            }
        });

        if (empty) {
            $('.btn-valider-addPump').attr('disabled', 'disabled');
        } else {
            $('.btn-valider-addPump').removeAttr('disabled');
        }
    });
});

////////////////////////////////////////
// Début Script Page Intervention
////////////////////////////////////////
$('a[href="#content-2"]').on("shown.bs.tab", function (e) {
    $("#selectIntervention").focus();
})

$("#selectIntervention").focusout(function () {
    var action = $("#selectIntervention option:selected").val();
    //console.log(barcode);

    if (action == "") {
        $("#selectIntervention").focus();
        return false;
    }
});

$("#serial").on('input', function () {
    if ($(this).val().length) {
        // textbox not empty
        if ($(this).val().length == 27 || $(this).val().length == 9) {
            $(".btn-valider-intervention").removeAttr("disabled");
        } else {
            $(".btn-valider-intervention").attr('disabled', 'disabled');
        }
        // Try to retreive Tag Name from serial number
        var testIt = $(this).val();
        var i = 0,
            j = 0,
            indx = [],
            msg;
        for (i = 0; i < arr.length; i++) {
            for (j = 0; j < arr[i].length; j++) {
                if (arr[i][j] === testIt) {
                    indx = [i, j];
                    break;
                }
            }
        }
        if (typeof indx[0] == "undefined" || typeof indx[1] == "undefined") {
            $("#tag").val('');
            localisation = "N/A";
        } else {
            $("#tag").val(arr[indx[0]][1]);
            localisation = arr[indx[0]][0];
        }
    } else {
        // textbox empty
        $("#tag").val('');
        $("#tag").prop('selected', false);
        $(".btn-valider-intervention").attr('disabled', 'disabled');
    }
});

$("#serial").keypress(function (e) {
    if (e.which == 13) {
        e.preventDefault();
        var serialNumber = $("#serial").val();
        //console.log(serialNumber.length);
        //console.log(arr);

        if (serialNumber.length == 27 || serialNumber.length == 9) {
            serialNumber = serialNumber.substr(serialNumber.length - 9);

            if (/^[A-Z]+$/.test(serialNumber.substring(0, 4))) {
                $("#serial").val(serialNumber);
            } else {
                $("#serial").val("");
                return;
            }
        } else {
            $("#serial").val("");
            return;
        }

        var testIt = serialNumber;
        var i = 0,
            k = 0,
            indx = [],
            msg;
        for (i = 0; i < arr.length; i++) {
            for (k = 0; k < arr[i].length; k++) {
                if (arr[i][k] === testIt) {
                    indx = [i, k];
                    break;
                }
            }
        }
        if (typeof indx[0] == "undefined" || typeof indx[1] == "undefined") {
            $("#tag").val("N/A");
            localisation = "N/A";
        } else {
            $("#tag").val(arr[indx[0]][1]);
            localisation = arr[indx[0]][0];
        }

        var action = $("#selectIntervention option:selected").val();
        if (action == "FIN") {
            saveData();
        }
        if (action == "REPAR") {
            $("#note").focus();
        }
        if (action == "REPARKCI" || action == "LOCATION") {
            $("#tracking").focus();
        }
    }
});

$("#tracking").keypress(function (e) {
    if (e.which == 13) {
        e.preventDefault();
        var tracking = $("#tracking").val();

        // Tracking PUROLATOR
        if (tracking.length == 34) {
            $("#tracking").val(tracking.substring(11, 23));
        } else {
            $("#tracking").val("");
            return;
        }

        var action = $("#selectIntervention option:selected").val();
        if (action == "REPARKCI") {
            $("#note").focus();
        }
        if (action == "LOCATION") {
            saveData();
        }
    }
});

$("#selectIntervention").change(function () {
    var action = $("#selectIntervention option:selected").val();
    console.log(action);

    if (action == "FIN") {
        $("#serial").prop("disabled", false);
        $("#tag").prop("disabled", false);
        $("#tracking").prop("disabled", true);
        $("#note").prop("disabled", true);
    }
    if (action == "REPAR") {
        $("#serial").prop("disabled", false);
        $("#tag").prop("disabled", false);
        $("#tracking").prop("disabled", true);
        $("#note").prop("disabled", false);
    }
    if (action == "REPARKCI") {
        $("#serial").prop("disabled", false);
        $("#tag").prop("disabled", false);
        $("#tracking").prop("disabled", false);
        $("#note").prop("disabled", false);
    }
    if (action == "LOCATION") {
        $("#serial").prop("disabled", false);
        $("#tag").prop("disabled", true);
        $("#tracking").prop("disabled", false);
        $("#note").prop("disabled", true);
    }
});

$("#tag").change(function () {
    var tagName = $("#tag option:selected").val();

    if (tagName != "") {
        var testIt = tagName;
        var i = 0,
            k = 0,
            indx = [],
            msg;
        for (i = 0; i < arr.length; i++) {
            for (k = 0; k < arr[i].length; k++) {
                if (arr[i][k] === testIt) {
                    indx = [i, k];
                    break;
                }
            }
        }
        if (typeof indx[0] == "undefined" || typeof indx[1] == "undefined") {
            $("#serial").val("");
            localisation = "N/A";
        } else {
            $("#serial").val(arr[indx[0]][2]);
            $(".btn-valider-intervention").removeAttr("disabled");
            localisation = arr[indx[0]][0];
        }
    }
});

function populateDropdown() {
    arr = json_obj["pompeVAC"]["inventaire"];
    // Populate dropdown
    var dropMenu = document.getElementById("tag");
    for (var i = 0; i < arr.length; i++) {
        var opt = arr[i][1];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        dropMenu.appendChild(el);
    }
};
////////////////////////////////////////
// Fin Script Page Intervention
////////////////////////////////////////

////////////////////////////////////////
// Début Script Page Historique
//
// Référence https://datatables.net/
////////////////////////////////////////
// Watch "CTRL" keypress to toggle "delete" button visibility.
$('body').on('keyup', function (e) {
    if (e.keyCode == 17) {
        //do something
        $(".btn-delete").attr("disabled", "disabled");
    }
    // After first keyup set to handle next keydown only once.
    $(this).one('keydown', function (e) {
        if (e.keyCode == 17) {
            $(".btn-delete").removeAttr("disabled");
        }
    });
});

$('.btn-delete').click(function () {
    if (currentRow != null) {
        var data = $('#example').DataTable().row(currentRow).data();
        console.log(data[0]);

        for (var i = 0; i < json_obj["pompeVAC"]["historique"].length; i++) {
            if (json_obj["pompeVAC"]["historique"][i][0].indexOf(data[0]) >= 0) {
                json_obj["pompeVAC"]["historique"].splice(i, 1);
            }
        }
        console.log(json_obj["pompeVAC"]["historique"]);

        // Get a new write batch
        var batch = db.batch();

        // Set the value of 'pompeVAC -> historique'
        var hemoRef = db.collection("pompeVAC").doc("historique");
        batch.set(hemoRef, {
            data: JSON.stringify(json_obj["pompeVAC"]["historique"])
        });

        // Commit the batch
        batch.commit().then(() => { // Write successful
            $("#error-alert").hide();
            $("#success-alert").show();

            if (document.getElementById("success-alert").classList.contains("d-none")) {
                document.getElementById("success-alert").classList.remove("d-none");
            }

            $('body,html').animate({
                scrollTop: 0
            }, 0);

            window.setTimeout(function () {
                $("#success-alert").hide();
                //document.getElementById('success-alert').classList.add('d-none');
            }, 5000);
        })
    }
});

function loadTable() {
    dataSet = json_obj["pompeVAC"]["historique"];

    // Create form, order by ID and hide the first column.
    table.clear().rows.add(dataSet).columns('.id').order('desc').columns([0]).visible(false).draw();
};
////////////////////////////////////////
// Fin Script Page Historique
////////////////////////////////////////

////////////////////////////////////////
// Début Script Page Autre
////////////////////////////////////////

// Force l'entrée des données en majuscules
$('#newTag, #newSerial').keyup(function () {
    $(this).val($(this).val().toUpperCase());
});

// Indices pour la localisation de la pompe
$(function () {
    var list = [
               "CHAUR",
               "Shawinigan",
               "Maskinongé",
               "BNY",
                "Prêt d'équipements"
            ];
    $("#newLocalisation").autocomplete({
        source: list
    });
});

$(".btn-valider-addPump").on("click", function () {
    var localisation = $("#newLocalisation").val();
    var tag = $("#newTag").val();
    var serial = $("#newSerial").val();

    newData = [localisation, tag, serial];
    json_obj["pompeVAC"]["inventaire"].push(newData);

    // Get a new write batch
    var batch = db.batch();

    // Set the value of 'hemodialyse -> inspection'
    var hemoRef = db.collection("pompeVAC").doc("inventaire");
    batch.set(hemoRef, {
        data: JSON.stringify(json_obj["pompeVAC"]["inventaire"])
    });

    // Commit the batch
    batch.commit().then(() => { // Write successful
        $("#error-alert").hide();
        $("#success-alert").show();

        if (document.getElementById("success-alert").classList.contains("d-none")) {
            document.getElementById("success-alert").classList.remove("d-none");
        }

        // Reset form entries
        $(':input', '#addPumpform')
            .not(':button, :submit, :reset, :hidden')
            .val('')

        $(".btn-valider-addPump").attr("disabled", "disabled");

        $('body,html').animate({
            scrollTop: 0
        }, 0);

        window.setTimeout(function () {
            $("#success-alert").hide();
            //document.getElementById('success-alert').classList.add('d-none');
        }, 5000);
    })
});
////////////////////////////////////////
// Fin Script Page Autre
////////////////////////////////////////

$(function () {
    $(document).on("click", ".alert-close", function () {
        $(this).parent().hide();
    })
});

$(".btn-valider-intervention").on("click", function () {
    saveData();
});

function saveData() {
    var currentDate = new Date();
    var currentDateString;

    // Generate unique ID from UNIX timestamp
    var entryID = $.now().toString();

    currentDateString = ('0' + currentDate.getDate()).slice(-2) + '-' +
        ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' +
        currentDate.getFullYear();

    var intervention = $("#selectIntervention option:selected").text().substring(3);
    var serial = $("#serial").val();
    var tag = $("#tag").val();
    var tracking = $("#tracking").val();
    var note = $("#note").val();

    newData = [entryID, currentDateString, intervention, tag, serial, localisation, tracking, note];
    json_obj["pompeVAC"]["historique"].push(newData);
    //console.log(JSON.stringify(json_obj["pompeVAC"]["historique"]));

    // Get a new write batch
    var batch = db.batch();

    // Set the value of 'pompeVAC -> historique'
    var hemoRef = db.collection("pompeVAC").doc("historique");
    batch.set(hemoRef, {
        data: JSON.stringify(json_obj["pompeVAC"]["historique"])
    });

    // Commit the batch
    batch.commit().then(() => { // Write successful
        $("#error-alert").hide();
        $("#success-alert").show();

        if (document.getElementById("success-alert").classList.contains("d-none")) {
            document.getElementById("success-alert").classList.remove("d-none");
        }

        $(':input', '#inputform')
            .not(':button, :submit, :reset, :hidden')
            .val('')
            .prop('checked', false)
            .prop("disabled", true);

        $('#selectIntervention')
            .prop('selected', false)
            .prop("disabled", false);

        $(".btn-valider-intervention").attr("disabled", "disabled");

        $("#selectIntervention").focus();

        $('body,html').animate({
            scrollTop: 0
        }, 0);

        window.setTimeout(function () {
            $("#success-alert").hide();
            //document.getElementById('success-alert').classList.add('d-none');
        }, 5000);
    })
};
