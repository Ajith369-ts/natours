import axios from "axios";
import { showAlert } from "./alerts";

const stripe = Stripe(
    "pk_test_51Nv0HASHS7lBNbz2kU6qADdZMWL44GfjVWHc3ZaooFfv54D8l22aY1A3Gv65hXTJfNmN1QaiUKSEEpXKI75574uM00ZWuhqVPB"
);

export const bookTour = async (tourId) => {
    try {
        const session = await axios(
            `/api/v1/bookings/checkout-session/${tourId}`
        );

        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch (err) {
        console.log(err);
        showAlert("error", err);
    }
};
