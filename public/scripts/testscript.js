$(window).on("load resize", function () {
    $("body").css("height", window.innerHeight);
});

// $('#peopleNearbyTab').on('click', function() {
//     $(this).toggleClass('active');
//     $('#registeredTab').toggleClass('active');
// });

// $('#registeredTabb').on('click', function() {
//     $(this).toggleClass('active');
//     $('#peopleNearbyTab').toggleClass('active');
// });


var test;

$(function(){
    $('#ViewMoreGlobal').on('click', function(){
        $.ajax({
          url: 'https://datingsite-moogliecute.c9users.io/ajax',
          type: 'get',
          contentType: 'application/json',
          success: function (data) {
            data.data.forEach(function(profile, index){
                $('#globalProfileImage_' + index).fadeTo(500,0 ,function(){
                    $(this).attr('src', 'images/ProfilePictures/' + profile.profileImage);
                    $(this).fadeTo(500,1);
                });
            
                $('#globalProfileLink_' + index).attr('href', '/profiles/' + profile._id);
                
                $('#globalProfileInformation_' + index).fadeOut(500, function() {
                    $(this).html(profile.firstname + " " + profile.lastname + " " + profile.age);
                    $(this).fadeIn(500);
                });
            });
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
          }
        });
    });
});


$(function(){
    $('#ViewBackGlobal').on('click', function(){
        $.ajax({
          url: 'https://datingsite-moogliecute.c9users.io/ajax/return',
          type: 'get',
          contentType: 'application/json',
          success: function (data) {
            data.data.forEach(function(profile, index){
                $('#globalProfileImage_' + index).fadeTo(500,0 ,function(){
                    $(this).attr('src', 'images/ProfilePictures/' + profile.profileImage);
                    $(this).fadeTo(500,1);
                });
            
                $('#globalProfileLink_' + index).attr('href', '/profiles/' + profile._id);
                
                $('#globalProfileInformation_' + index).fadeOut(500, function() {
                    $(this).html(profile.firstname + " " + profile.lastname + " " + profile.age);
                    $(this).fadeIn(500);
                });
            });
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
          }
        });
    });
});
