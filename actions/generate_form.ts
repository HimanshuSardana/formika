"use server";
import { createClient } from "@/utils/supabase/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

type FormDetails = {
        email: string;
        formDescription: string;
        formName: string;
};

const schema = {
        description: "List of form fields",
        type: SchemaType.ARRAY,
        items: {
                type: SchemaType.OBJECT,
                properties: {
                        name: {
                                type: SchemaType.STRING,
                                description: "Name of the form field",
                        },
                        type: {
                                type: SchemaType.STRING,
                                description: "Type of the form field (e.g., text, radio, select)",
                                enum: ["text", "textarea", "radio", "select", "checkbox", "number", "email"], // Allowed field types
                        },
                        values: {
                                type: SchemaType.OBJECT,
                                description: 'Only if the field type is "select" or "radio"',
                                nullable: true,
                                properties: {
                                        items: {
                                                type: SchemaType.ARRAY,
                                                description: "An array of options for radio buttons and select boxes",
                                                items: {
                                                        type: SchemaType.OBJECT,
                                                        properties: {
                                                                value: {
                                                                        type: SchemaType.STRING,
                                                                        description: "The actual value of the option",
                                                                },
                                                                label: {
                                                                        type: SchemaType.STRING,
                                                                        description: "The display label for the option should be in title case, in case of multiple words add spaces between the words",
                                                                },
                                                        },
                                                        required: ["value", "label"], // Ensure both value and label are provided
                                                },
                                        },
                                },
                        },
                },
                required: ["name", "type"], // Ensure name and type are always present
        },
};

export default async function generateForm({ email, formDescription, formName }: FormDetails) {
        const supabase = await createClient();

        if (!formDescription || typeof formDescription !== "string") {
                throw new Error("Invalid form description provided.");
        }

        try {
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({
                        model: "gemini-1.5-flash",
                        generationConfig: {
                                responseMimeType: "application/json",
                                responseSchema: schema,
                        },
                });

                const prompt = `Given the following form description, generate a form: "${formDescription}". Respond with nothing but JSON, no additional text.`;
                const result = await model.generateContent(prompt);

                const generatedContent = await result?.response?.text?.();
                if (!generatedContent) {
                        throw new Error("Failed to generate content from AI model.");
                }

                console.log("Generated form content (raw):", generatedContent);
                const parsedContent = JSON.parse(generatedContent); // Parse the JSON output
                console.log("Generated form content:", parsedContent);

                const { data, error } = await supabase.from("forms").insert([
                        {
                                created_by_email: email,
                                formSchema: parsedContent,
                                formName: formName,
                                createdAt: new Date().toISOString(),
                        },
                ]);

                if (error) {
                        throw new Error(`Error inserting form into database: ${error.message}`);
                }

                return { success: true }
        } catch (err) {
                console.error("Error generating form:", err);
        }
}

