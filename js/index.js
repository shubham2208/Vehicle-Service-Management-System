// Define the PushPlugin.
var pushNotification = window.plugins.pushNotification;

// Platform-specific registrations.
if ( device.platform == 'android' || device.platform == 'Android' ){     
    // Register with GCM for Android apps.
    pushNotification.register(
       app.successHandler, app.errorHandler,
       { 
        "senderID": GCM_SENDER_ID, 
        "ecb": "app.onNotificationGCM" 
        });
} else if (device.platform === 'iOS') {
    // Register with APNS for iOS apps.
    pushNotification.register(
        app.tokenHandler,
        app.errorHandler, {
            "ecb": "app.onNotificationAPN"
        });
}
else if(device.platform === "Win32NT"){    
    // Register with MPNS for WP8 apps.
    pushNotification.register(
        app.channelHandler,
        app.errorHandler,
        {
            "channelName": "MyPushChannel",
            "ecb": "app.onNotificationWP8",
            "uccb": "app.channelHandler",
            "errcb": "app.ErrorHandler"
    });
}
////////////////////////////////
// Handle the token from APNS and create a new hub registration.
tokenHandler: function (result) {
    if (mobileClient) {
        // Call the integrated Notification Hub client.
        var hub = new NotificationHub(mobileClient);

        // This is a template registration.
        var template = "{\"aps\":{\"alert\":\"$(message)\"}}";

        // (deviceId, ["tag1","tag2"], templateName, templateBody, expiration)
        hub.apns.register(result, null, "myTemplate", template, null).done(function () {
            alert("Registered with hub!");
        }).fail(function (error) {
            alert("Failed registering with hub: " + error);
        });
    }
}