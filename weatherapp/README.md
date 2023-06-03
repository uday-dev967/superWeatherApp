# Getting Started with SUPER WHEATHER APP

The Goal:

Super weather is an react web application meant use your mobile phone to track or check current weather.

# MAIN PAGE
user can navigate to login or signup from here by clicking on the buttons
if user is already loged in then the page will redirected to HOME PAGE
![](https://res.cloudinary.com/dieyyopcy/image/upload/v1684046182/mainpage-sm_pyjjbn.png)

# REGISTER PAGE
user can signup from here by filling the form and clicking on the create account button
![](https://res.cloudinary.com/dieyyopcy/image/upload/v1684046226/singuppage-sm_wt9d7l.png)

# LOGIN PAGE
user can login by filling the credential and clicking on the DIVE IN button
# Note : Use Below Credentials
# Credentials - {email: 'udaychakravarthi22@gmail.com', password: 'uday@2023'}

 ![](https://res.cloudinary.com/dieyyopcy/image/upload/v1684046200/login-sm_f5svb2.png)

# HOME PAGE
 This page shows the Header current location weather and favourite location weather
 if the user is not logged in (unathunticated user) and tries to access the page it will redirect to MAIN PAGE
 ![](https://res.cloudinary.com/dieyyopcy/image/upload/v1684044398/homesuccess-lg_h07aqg.png)

 # Home failure view
 When there is a error in displaying the current weather data then UI will be as shown in below
 By clicking on Back to Home the page will redirect to Home page
 ![](https://res.cloudinary.com/dieyyopcy/image/upload/v1684042696/failureview-sm_nunoax.png)
 ![](https://res.cloudinary.com/dieyyopcy/image/upload/v1684043019/failureview-lg_wakylo.png)
 
 # Favourites Failure view
 when there is a error in displaying the favourites weather data then UI will be as shown in below
 ![](https://res.cloudinary.com/dieyyopcy/image/upload/v1684041808/favfailure-lg_jvpsmi.png)
 
 # Home page Functionality

 1. its shows current location weather data with current time 
 2. By clicking on any current location on favourte location the page will be redirected to detailed weather page if there is no errors 
    else displays failure view
 3. user can search a location in the search bar it will navigate DETAIL WEATHER PAGE

 # Search function
 # Note : 
   Enter only city or city,2-letter country code 
   otherwise any informal search redirect Failure Page
 # Invalid search Result view 
 ![](https://res.cloudinary.com/dieyyopcy/image/upload/v1684045602/searchview-fail-lg_xqswiv.png)

 # Logout Button 

 by clicking on the logout button the user will be logged out and redireted to MAIN PAGE

# Detail weather page
1. it show the selected or searched location current weather
2. user can add or delete favourites from this page 
3. Based favourites REMOVE OR ADD TO FAV button will be displayed
4. if ADD TO FAV is clicked the location will be added to favourites and will be displayed on home page
5. if REMOVE is clicked the location will be remove from favourites and will not appear in the home page
![](https://res.cloudinary.com/dieyyopcy/image/upload/v1684045634/searchview-sm_s1qtyd.png)
![](https://res.cloudinary.com/dieyyopcy/image/upload/v1684044671/detailview-sm_rkzwfi.png)
![](https://res.cloudinary.com/dieyyopcy/image/upload/v1684045618/searchview-lg_vhz0pc.png)