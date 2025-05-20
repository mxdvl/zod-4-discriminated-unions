import { render } from "preact";
import { useState } from "preact/hooks";
import * as z from "zod/v3";

const kitchenSchema = z.discriminatedUnion("utility", [
  z.object({
    utility: z.literal("none"),
    name: z.literal("None"),
  }),
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
    position: z.enum(["left", "center", "right"]),
  }),
  z.object({
    utility: z.literal("microwave"),
    name: z.literal("Microwave oven"),
    watts: z.enum(["600", "800", "1000"]),
  }),
]);

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
                default:
                  return prev;
              }
            })
          }
          name="Selected Utility"
        >
          {kitchenSchema.options.map(({ shape }) => (
            <option value={shape.utility.value}>{shape.name.value}</option>
          ))}
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
                kitchenSchema.options[1].shape.temperature.minValue ?? undefined
              }
              max={
                kitchenSchema.options[1].shape.temperature.maxValue ?? undefined
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
            {kitchenSchema.options[1].shape.position.options.map((position) => (
              <label>
                <input
                  type="radio"
                  name="position"
                  value={position}
                  checked={cooking.position === position}
                  onChange={({ currentTarget: { checked } }) =>
                    checked && setCooking({ ...cooking, position })}
                />
                {position}
              </label>
            ))}{" "}
          </fieldset>
          {cooking.position === "bottom" && (
            <>The bottom tray is great for pies</>
          )}
          {cooking.position === "middle" && <>The middle tray is versatile</>}
          {cooking.position === "top" && (
            <>
              The top tray is great for roasting
              veggies{cooking.temperature < 200 && <>– with at least 200°C</>}
            </>
          )}
        </>
      )}
    </main>
  );
}

// render the app
const container = document.getElementById("app");
if (!container) throw Error("missing container");
render(<Kitchen />, container);
