import { render } from "preact";
import { useState } from "preact/hooks";
import * as z from "zod/v4";

const kitchenSchema = z.discriminatedUnion("utility", [
  z.object({ utility: z.literal("none"), name: z.literal("None") }),
  z.object({
    utility: z.literal("oven"),
    name: z.literal("Electric convection oven"),
    temperature: z.number().min(50).max(300),
    position: z.enum(["bottom", "middle", "top"]),
  }),
  z.object({
    utility: z.literal("cooker"),
    name: z.literal("Cooker hob"),
    heat: z.number().min(1).max(9),
    position: z.enum(["left", "right", "top"]),
  }),
  z.object({
    utility: z.literal("microwave"),
    name: z.literal("Microwave oven"),
    watts: z.enum(["600", "800", "1000"]),
  }),
]);

console.log(kitchenSchema.def.options);

export function Kitchen() {
  const [cooking, setCooking] = useState<z.infer<typeof kitchenSchema>>({
    utility: "none",
    name: "None",
  });

  return (
    <main>
      <label>
        Pick a cooking utility:
        <select
          value={cooking.utility}
          onChange={({ currentTarget: { value } }) =>
            setCooking((prev) => {
              switch (value) {
                case "oven":
                  return {
                    utility: value,
                    name: "Electric convection oven",
                    temperature: 100,
                    position: "middle",
                  };
                case "cooker":
                  return {
                    utility: value,
                    name: "Cooker hob",
                    heat: 7,
                    position: "right",
                  };
                case "microwave":
                  return {
                    utility: value,
                    name: "Microwave oven",
                    watts: "800",
                  };
                case "none":
                  return {
                    utility: value,
                    name: "None",
                  };
                default:
                  return prev;
              }
            })
          }
          name="Selected Utility"
        >
          {kitchenSchema.def.options.flatMap(
            ({
              shape: {
                utility: {
                  values: [value],
                },
                name: {
                  values: [name],
                },
              },
            }) =>
              value && name ? [<option value={value}>{name}</option>] : [],
          )}
        </select>
      </label>
      <p>
        {cooking.utility !== "none"
          ? `You’re cooking with ${cooking.name}`
          : `Not cooking`}
      </p>
      {cooking.utility === "oven" && (
        <>
          <label>
            <input
              type="range"
              min={
                kitchenSchema.def.options[1].shape.temperature.minValue ??
                undefined
              }
              max={
                kitchenSchema.def.options[1].shape.temperature.maxValue ??
                undefined
              }
              onChange={({ currentTarget: { value } }) =>
                setCooking((prev) =>
                  prev.utility === "oven"
                    ? { ...prev, temperature: Number(value) }
                    : prev,
                )
              }
            />
            {cooking.temperature}°C
          </label>
          <fieldset>
            {kitchenSchema.def.options[1].shape.position.options.map(
              (position) => (
                <label>
                  <input
                    type="radio"
                    name="position"
                    value={position}
                    checked={cooking.position === position}
                  />
                  {position}
                </label>
              ),
            )}{" "}
          </fieldset>
        </>
      )}
    </main>
  );
}

// render the app
const container = document.getElementById("app");
if (!container) throw Error("missing container");
render(<Kitchen />, container);
