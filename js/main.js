var contacts = [
    { Name: "Sandesh D", Photo: 'http://lorempixel.com/100/100/people/1', Address: "Hyderabad, Jubillee Hills1", Telephone: "0123456789", Email: "sandesh@gmail.com"},
    { Name: "Paul Irish", Photo: 'http://lorempixel.com/100/100/people/2', Address: "San Francisco", Telephone: "0123456789", Email: "paul@gmail.com"},
    { Name: "Addy Oswani", Photo: 'http://lorempixel.com/100/100/people/3', Address: "London, England", Telephone: "0123456789", Email: "addy@gmail.com"},
    { Name: "John Doe", Photo: 'http://lorempixel.com/100/100/people/4', Address: "Unknown City", Telephone: "0123456789", Email: "johndoe@gmail.com"},
    { Name: "Mark Henry", Photo: 'http://lorempixel.com/100/100/people/5', Address: "Washington, DC", Telephone: "0123456789", Email: "mark@gmail.com"},
    { Name: "Shemous", Photo: 'http://lorempixel.com/100/100/people/6', Address: "Washington, DC", Telephone: "0123456789", Email: "shemous@gmail.com"},
    { Name: "Randy", Photo: 'http://lorempixel.com/100/100/people/7', Address: "Washington, DC", Telephone: "0123456789", Email: "randy@gmail.com"},
    { Name: "Daniel Brian", Photo: 'http://lorempixel.com/100/100/people/8', Address: "Washington, DC", Telephone: "0123456789", Email: "daniel@gmail.com"}
];

var Contact = Backbone.Model.extend({
    defaults: {
        Photo: "./img/anonymous.png",
        Name: "John Doe",
        Email: "Email Address",
        Address: "Jubille Hills, Hyderabad",
        Telephone: "020222222"
    }
});

var ContactView = Backbone.View.extend({
    className: "contactCard row-fluid",
    template: _.template($("#contactTmpl").html()),

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "click .icon-edit": "displayEditBox"       
    },

    displayEditBox: function () {
    	$('.editDetails').slideUp(200);
    	if(this.$el.find('.editDetails').is(':visible'))
	    	this.$el.find('.editDetails').slideUp(200);
    	else 
    		this.$el.find('.editDetails').slideDown(200);
    }
});

var Contacts = Backbone.Collection.extend({
    model: Contact
    //localStorage: new Backbone.LocalStorage("contactList")
});

var ContactsView = Backbone.View.extend({
    el: $("#contacts"),

    initialize: function () {
        this.collection = new Contacts(contacts);
        this.render();      
    },

    render: function () {
        this.$el.find("article").remove();

        _.each(this.collection.models, function (item) {
            this.renderContact(item);
        }, this);
    },

    renderContact: function (item) {
        var contactView = new ContactView({
            model: item
        });
        this.$el.append(contactView.render().el);
    },

    events: {
       
    }
});

var contacts = new ContactsView(); 