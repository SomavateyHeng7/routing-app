import { redirect } from "react-router-dom";
import { deleteContact } from "../contacts";

export async function action({ params }) {

    await deleteContact(params.contactId); // Deletes the contact using the ID from params
    return redirect("/"); // Redirects to the home page after deletion
}
