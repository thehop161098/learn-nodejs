$(function () {
   // TOOGLE FORM NOTI
   $('.openNotification').click(function (event) {
      event.stopPropagation();
      $(".formNotification").toggle("fast");
   });
   $(".formNotification").on("click", function (event) {
      event.stopPropagation();
   });
   
   $(document).on("click", function () {
      $(".formNotification").hide();
   });
   // TOOGLE FORM USER SETTING
   $(document).ready(function () {
      $('.openUserSetting').click(function (event) {
         event.stopPropagation();
         $(".formUserSetting").toggle("fast");
      });
   });
   $(document).on("click", function () {
      $(".formUserSetting").hide();
   });
   // TOOGLE FORM ADD/EDIT REVENUE
   $(document).ready(function () {
      $('.addItemRevenue').click(function (event) {
         $(".formRevenue").toggle("slow, swing");
      });
   });
   $(document).ready(function () {
      $('.cancelSubmitRevenue').click(function (event) {
         $(".formRevenue").toggle("slow, swing");
      });
   });
   // TOOGLE FORM ADD/EDIT WALLET
   $(document).ready(function () {
      $('.addItemWallet').click(function (event) {
         $(".formWallet").toggle("slow, swing");
      });
   });
   $(document).ready(function () {
      $('.cancelSubmitWallet').click(function (event) {
         $(".formWallet").toggle("slow, swing");
      });
   });
   // TOOGLE FORM UPDATE INFO USER
   $(document).ready(function () {
      $('.openFormUpdateInfoUser').click(function (event) {
         $(".formUpdateInfoUser").toggle("slow, swing");
      });
   });
   $(document).ready(function () {
      $('.cancelSubmitUpdateInfoUser').click(function (event) {
         $(".formUpdateInfoUser").toggle("slow, swing");
      });
   });
   // TOOGLE FORM CHANGE PASSWORD
   $(document).ready(function () {
      $('.openFormChangePassword').click(function (event) {
         $(".formChangePassword").toggle("slow, swing");
      });
   });
   $(document).ready(function () {
      $('.cancelSubmitChangePassword').click(function (event) {
         $(".formChangePassword").toggle("slow, swing");
      });
   });
});

