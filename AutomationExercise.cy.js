/// <reference types="cypress" />  


// making sure cypress does not fail testcases due to some unecessary errors
Cypress.on('uncaught:exception', (err, runnable) => {
    return false
  })


// Declaring variables at suite level. It's good for resuability of variable names across
// multiple test cases
  describe('My Onafriq Assignment', () => {
    let username = 'qat@mailinator.com';
    let password  = '123456';
    let items = {};
    let count = 0;

// Using the function below to capture all commands that needs to be run in every test cases declared
// within it.
    beforeEach(() => {
        // STEP 1: Visit the website
        cy.visit('https://www.automationexercise.com')
    });

    it('Automated Test', () => {
        // STEP 2: Sign in using the provided credentials
        cy.get('.shop-menu > .nav > :nth-child(4) > a', {force: true}).click() // CLicks on login/sign up
        cy.get('[data-qa="login-email"]', {force: true}).type(username) // typing in the username
        cy.get('[data-qa="login-password"]', {force: true}).type(password) //typing in the password
        cy.get('[data-qa="login-button"]').click({force: true}) //clicking on login
        cy.wait(4000)

        // STEP 3: Printing out sorted label and prices of featured items
        cy.get('.features_items > div').each(($element, index, $list) => { //iterating over the elements in the features_item container
            const label = $element.find('.productinfo p').text(); //extracting the label as text
            const price = $element.find('.productinfo h2').text(); //extracting the price as text
            const cleanedPrice = parseInt(price.replace(/[^\d]/g, ''), 10); // striping the price of non-numeric 
                                                                              //characters and coarsing into int
            if (!isNaN(cleanedPrice)) {       // ensuring that NaN are screened out
                items[label] = cleanedPrice; // saving the cleaned price as values into an object while using the label as key (index)
                count++  // keeping the total count of entries in the object while iterating
            }
        }).then(() => {
            const sortedList = Object.fromEntries(  // sorting the pairs in the object using the price
                Object.entries(items).sort(([, a], [, b]) => a - b)
            );

        // printing the total number of entries
        console.log(`We have total number of ${count} featured items today. Find below the list and their prices.\n`);

            // printing the sorted list vertically while appending the stripped currency (Rs.) as prefix to the price
            console.log('List of featured items and their prices:');
            Object.entries(sortedList).forEach(([label, price]) => {
                console.log(`${label}: Rs. ${price}`);
            });
        });

        // STEP 4: Adding Fancy Green Top and Summer White Top to cart
        cy.get(':nth-child(1) > .panel-heading > .panel-title', {force: true}).click({force: true}) //Clicking on women
        cy.get('#Women > .panel-body > ul > :nth-child(1) > a').click({force: true}) // clicking on Dress
        cy.get(':nth-child(1) > .panel-heading > .panel-title', {force: true}).click({force: true}) //Clicking on women
        cy.wait(3000)
        cy.get('#Women > .panel-body > ul > :nth-child(2) > a').click({force: true}) //Clicking on Tops
        cy.wait(3000)
        
        //Adding Fancy Green Top to Cart
        cy.get(':nth-child(7) > .product-image-wrapper > .single-products > .productinfo > .btn').click({force: true})
        cy.get('.brands_products > h2', {force: true}).click({force: true})  //clicking away to clear pop-up
        cy.wait(3000)

        //Adding Summer White Top to Cart
        cy.get(':nth-child(5) > .product-image-wrapper > .single-products > .productinfo > .btn').click({force: true})
        cy.get('.brands_products > h2', {force: true}).click({force: true}) //clicking away to clear pop-up

        // STEP 5: View Cart and Proceed to Checkout
        cy.get('.shop-menu > .nav > :nth-child(3) > a').click({force: true}) //clicking on Cart to view items added to cart
        cy.get('.col-sm-6 > .btn', {force: true}).click({force: true}) //Proceeding to checkout
        cy.get('.form-control').type('Order Placed') //Adding comment
        cy.get(':nth-child(7) > .btn').click({force: true}) //Placing Order
        cy.get('[data-qa="name-on-card"]').type('Test Card') //Typing card Name
        cy.get('[data-qa="card-number"]').type(410000000000) //Typing Card Number
        cy.get('[data-qa="cvc"]').type(123) //Tying card CVV
        cy.get('[data-qa="expiry-month"]').type('01') //Typing card expiry month
        cy.get('[data-qa="expiry-year"]').type(1900) //Typing card expiry Year
        cy.get('[data-qa="pay-button"]').click() //Paying and Confirming Order
    });
});

