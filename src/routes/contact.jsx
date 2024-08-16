import { useLoaderData, Form, useFetcher, redirect } from "react-router-dom";
import { getContact, updateContact, deleteContact } from "../contacts";

export async function loader({ params }) {
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return { contact };
}

export async function action({ request, params }) {
  const formData = await request.formData();

  if (request.method === "POST") {
    // Handle updating the favorite status
    return updateContact(params.contactId, {
      favorite: formData.get("favorite") === "true",
    });
  } else if (request.method === "DELETE") {
    // Handle deleting the contact
    await deleteContact(params.contactId);
    return redirect("/");  // Redirect to home or another route after deletion
  }
}

export default function Contact() {
  const { contact } = useLoaderData();
  const fetcher = useFetcher();

  return (
    <div id="contact">
      <img
        src={contact.avatar || `https://robohash.org/${contact.id}.png?size=200x200`}
        alt={`${contact.first} ${contact.last}`}
      />
      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`} rel="noopener noreferrer">
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <fetcher.Form
            method="delete"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </fetcher.Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }) {
  const fetcher = useFetcher();
  const favorite = fetcher.formData ? fetcher.formData.get("favorite") === "true" : contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
