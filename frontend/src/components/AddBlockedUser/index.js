import { gql, useMutation } from "@apollo/client";

function AddTodo() {
    let input;
    const [addTodo, { data }] = useMutation(ADD_TODO);

    return (
      <div>
        <form
          onSubmit={e => {
            e.preventDefault();
            addTodo({ variables: { type: input.value } });
            input.value = '';
          }}
        >
          <input
            ref={node => {
              input = node;
            }}
          />
          <button type="submit">Add Blocked User</button>
        </form>
      </div>
    );
  }
