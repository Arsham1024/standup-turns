<script>
	import { Button } from "$lib/components/ui/Button";
	import * as Table from "$lib/components/ui/table";

	let participants = [
		{ name: "Alice", checked: false },
		{ name: "Bob", checked: false },
		{ name: "Charlie", checked: false },
		{ name: "David", checked: false },
	];
	let newName = "";
	let showModal = false;

	function shuffleArray() {
		let n = participants.length;
		while (n) {
			let i = Math.floor(Math.random() * n--);
			[participants[n], participants[i]] = [participants[i], participants[n]];
		}
		participants.forEach((p) => (p.checked = false));
		participants = participants.slice();
	}

	function addParticipant() {
		if (newName.trim() !== "") {
			participants.push({ name: newName, checked: false });
			participants = [...participants];
			newName = "";
			showModal = false; // Close the modal after adding the name
		}
	}

	function toggleCheck(index) {
		participants[index].checked = !participants[index].checked;
		participants = [...participants]; // Reassign to trigger reactivity
	}

	function removeParticipant(index, event) {
		event.stopPropagation(); // Prevents the row click event when the delete icon is clicked
		participants.splice(index, 1);
		participants = [...participants]; // Reassign to trigger reactivity
	}
</script>

<main class="text-center mt-12">
	<Button class="rounded-xl" on:click={() => (showModal = true)}>
		<span class="material-icons">add</span>
	</Button>
	<Button class="rounded-xl ml-4" on:click={shuffleArray}>Shuffle</Button>
	<Table.Root>
		<Table.Caption>Participant List</Table.Caption>
		<Table.Header>
			<Table.Row class=" text-center">
				<Table.Head>Name</Table.Head>
				<Table.Head>actions</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each participants as participant, index}
				<Table.Row class={participant.checked ? "line-through" : ""} on:click={() => toggleCheck(index)}>
					<Table.Cell class="font-medium">
						{participant.name}
					</Table.Cell>
					<Table.Cell>
						<Button class="cursor-pointer text-red-400 hover:shadow-lg hover:bg-gray-100 shadow-sm bg-gray-100" on:click={() => removeParticipant(index)}>delete</Button>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	{#if showModal}
		<div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
			<div class="bg-white rounded-lg p-4">
				<input type="text" bind:value={newName} class="rounded-xl p-2 border-2 border-gray-300" placeholder="Enter new name" on:keyup={(event) => event.key === "Enter" && addParticipant()} />
				<Button class="rounded-xl mt-4" on:click={addParticipant}>Add Name</Button>
				<Button class="rounded-xl mt-4 text-red-500" on:click={() => (showModal = false)}>Cancel</Button>
			</div>
		</div>
	{/if}
</main>
