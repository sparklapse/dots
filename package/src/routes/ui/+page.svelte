<script lang="ts">
  import { Dropdown, OrderableList } from "$lib/ui/index.js";
</script>

<div class="dots-bg h-auto w-full overflow-x-hidden p-4">
  <h1>
    <span class="text-5xl font-bold">DUI</span>
    <sub>(Dots UI aka. <span class="italic">Design Under the Influence</span>)</sub>
  </h1>

  <div class="mt-4 flex flex-col gap-2">
    <!-- Colors -->
    <div>
      <h2 class="text-2xl font-bold">Colors</h2>
      <table class="table w-full table-fixed">
        <thead class="table-header-group">
          <tr>
            <th class="w-24">Primary</th>
            <th class="w-24">Secondary</th>
            <th class="w-24">Grey</th>
          </tr>
        </thead>
        <tbody class="table-row-group">
          <tr>
            <td class="bg-dots-maceron-50">50</td>
            <td class="bg-dots-tea-50">50</td>
            <td class="bg-dots-coffee-50">50</td>
          </tr>
          <tr>
            <td class="bg-dots-maceron-100">100</td>
            <td class="bg-dots-tea-100">100</td>
            <td class="bg-dots-coffee-100">100</td>
          </tr>
          <tr>
            <td class="bg-dots-maceron-200">200</td>
            <td class="bg-dots-tea-200">200</td>
            <td class="bg-dots-coffee-200">200</td>
          </tr>
          <tr>
            <td class="bg-dots-maceron-300">300</td>
            <td class="bg-dots-tea-300">300</td>
            <td class="bg-dots-coffee-300">300</td>
          </tr>
          <tr>
            <td class="bg-dots-maceron-400">400</td>
            <td class="bg-dots-tea-400">400</td>
            <td class="bg-dots-coffee-400">400</td>
          </tr>
          <tr>
            <td class="bg-dots-maceron-500">500</td>
            <td class="bg-dots-tea-500">500</td>
            <td class="bg-dots-coffee-500">500</td>
          </tr>
          <tr>
            <td class="bg-dots-maceron-600 text-white">600</td>
            <td class="bg-dots-tea-600 text-white">600</td>
            <td class="bg-dots-coffee-600 text-white">600</td>
          </tr>
          <tr>
            <td class="bg-dots-maceron-700 text-white">700</td>
            <td class="bg-dots-tea-700 text-white">700</td>
            <td class="bg-dots-coffee-700 text-white">700</td>
          </tr>
          <tr>
            <td class="bg-dots-maceron-800 text-white">800</td>
            <td class="bg-dots-tea-800 text-white">800</td>
            <td class="bg-dots-coffee-800 text-white">800</td>
          </tr>
          <tr>
            <td class="bg-dots-maceron-900 text-white">900</td>
            <td class="bg-dots-tea-900 text-white">900</td>
            <td class="bg-dots-coffee-900 text-white">900</td>
          </tr>
          <tr>
            <td class="bg-dots-maceron-950 text-white">950</td>
            <td class="bg-dots-tea-950 text-white">950</td>
            <td class="bg-dots-coffee-950 text-white">950</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Input -->
    <div class="flex flex-wrap gap-5">
      <!-- Buttons -->
      <div>
        <h2 class="text-2xl font-bold">Buttons</h2>
        <div class="flex flex-col gap-2">
          <div class="flex items-baseline gap-2">
            <button class="dots-btn dots-btn-lg dots-btn-maceron">Large</button>
            <button class="dots-btn dots-btn-maceron">Medium (default)</button>
            <button class="dots-btn dots-btn-sm dots-btn-maceron">Small</button>
          </div>
          <div class="flex gap-2">
            <button class="dots-btn dots-btn-maceron">Primary</button>
            <button class="dots-btn dots-btn-tea">Secondary</button>
          </div>
          <div class="flex gap-2">
            <button class="dots-btn dots-btn-outline dots-btn-maceron">Primary</button>
            <button class="dots-btn dots-btn-outline dots-btn-tea">Secondary</button>
          </div>
        </div>
      </div>
      <!-- Inputs -->
      <div>
        <h2 class="text-2xl font-bold">Inputs</h2>
        <div class="flex flex-col gap-2">
          <div class="flex gap-2">
            <label for="input-default">Default Input</label>
            <input name="input-default" class="dots-input" value="The quick brown fox..." />
          </div>
          <div class="flex gap-2">
            <label for="input-text">Text Input</label>
            <input
              name="input-text"
              type="text"
              class="dots-input"
              placeholder="Enter some text..."
            />
          </div>
          <div class="flex gap-2">
            <label for="input-number">Number Input</label>
            <input name="input-number" type="number" class="dots-input" value="10987654321" />
          </div>
          <div class="flex gap-2">
            <label for="input-password">Password</label>
            <input name="input-password" type="password" class="dots-input" value="password123" />
          </div>
        </div>
      </div>
    </div>

    <!-- Cards -->
    <div>
      <h2 class="text-2xl font-bold">Cards</h2>
      <div class="flex flex-wrap gap-2">
        <div class="dots-card max-w-[14rem]">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, fugit voluptatibus. Velit
            rerum earum at qui harum, aut, consequuntur recusandae, sed distinctio reiciendis
            molestias provident nam! Quaerat distinctio dicta provident.
          </p>
        </div>
        <div class="dots-card dots-card-maceron max-w-[14rem]">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, fugit voluptatibus. Velit
            rerum earum at qui harum, aut, consequuntur recusandae, sed distinctio reiciendis
            molestias provident nam! Quaerat distinctio dicta provident.
          </p>
        </div>
        <div class="dots-card dots-card-tea max-w-[14rem]">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, fugit voluptatibus. Velit
            rerum earum at qui harum, aut, consequuntur recusandae, sed distinctio reiciendis
            molestias provident nam! Quaerat distinctio dicta provident.
          </p>
        </div>
      </div>
    </div>
  </div>

  <h1 class="mt-4">
    <span class="text-5xl font-bold">Components</span>
    <sub>Premade components with built-in logic</sub>
  </h1>

  <div class="mt-4 flex flex-col gap-2">
    <div class="flex flex-col gap-1">
      <h2 class="text-2xl font-bold">Re-orderable List</h2>
      <OrderableList
        items={[
          {
            id: "abc123",
            label: "Item 1",
          },
          {
            id: "def456",
            label: "Item 2",
          },
          {
            id: "ghi789",
            label: "Item 3",
          },
        ]}
        let:item
      >
        <div class="w-full select-none p-2">{item.label}</div>
      </OrderableList>
    </div>
    <div class="flex flex-col gap-1">
      <h2 class="text-2xl font-bold">Dropdown</h2>
      <div class="flex gap-2">
        <Dropdown class="dots-btn dots-btn-tea w-52">
          <span>Basic</span>
          <div slot="dropdown" class="my-2 dots-card dots-card-tea">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, fugit voluptatibus.
              Velit rerum earum at qui harum, aut, consequuntur recusandae, sed distinctio
              reiciendis molestias provident nam! Quaerat distinctio dicta provident.
            </p>
          </div>
        </Dropdown>
        <Dropdown class="dots-btn dots-btn-tea w-52">
          <span>Max Height</span>
          <div
            slot="dropdown"
            class="flex flex-col my-2 dots-card dots-card-tea h-full overflow-y-auto"
          >
            <div class="h-full max-h-[20rem] overflow-y-auto scrollbar-thin">
              {#each Array.apply(null, Array(5)).map(function () {}) as _}
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, fugit voluptatibus.
                  Velit rerum earum at qui harum, aut, consequuntur recusandae, sed distinctio
                  reiciendis molestias provident nam! Quaerat distinctio dicta provident.
                </p>
              {/each}
            </div>
          </div>
        </Dropdown>
      </div>
    </div>
  </div>
</div>
