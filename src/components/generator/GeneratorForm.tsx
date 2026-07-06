"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  generatorSchema,
  type GeneratorFormValues,
} from "@/lib/validation/schemas";
import { TONES, LENGTHS } from "@/types";
import { Button, Card, Icon, Input, Label, Select, Textarea } from "@/components/ui";
import { ResumeInput } from "./ResumeInput";

const TONE_OPTIONS = TONES.map((t) => ({ label: t, value: t }));
const LENGTH_OPTIONS = LENGTHS.map((l) => ({ label: l, value: l }));

interface GeneratorFormProps {
  /** Called with validated values when the user submits. */
  onGenerate: (values: GeneratorFormValues) => void;
  isGenerating: boolean;
}

/**
 * The left-hand input panel. Owns the form state (React Hook Form) and
 * validation (Zod), but delegates *what happens on submit* to the parent via
 * `onGenerate` — so business logic stays out of this presentational form.
 */
export function GeneratorForm({ onGenerate, isGenerating }: GeneratorFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<GeneratorFormValues>({
    resolver: zodResolver(generatorSchema),
    defaultValues: {
      resumeText: "",
      jobDescription: "",
      tone: "Professional",
      length: "Standard",
      additionalInstructions: "",
    },
  });

  const resumeText = watch("resumeText");

  return (
    <Card large className="p-6">
      <h3 className="mb-6 text-2xl font-semibold text-foreground">
        Job Application Details
      </h3>

      <form onSubmit={handleSubmit(onGenerate)} className="space-y-6" noValidate>
        {/* Resume — upload or paste */}
        <div data-tour="resume">
          <ResumeInput
            value={resumeText}
            onChange={(v) => setValue("resumeText", v, { shouldValidate: true })}
            error={errors.resumeText?.message}
          />
        </div>

        {/* Job description */}
        <div data-tour="job">
          <Label htmlFor="jobDescription" className="mb-2">
            Job Description
          </Label>
          <Textarea
            id="jobDescription"
            rows={6}
            placeholder="Paste the full job posting text here so the AI can extract key requirements..."
            {...register("jobDescription")}
          />
          {errors.jobDescription && (
            <p className="mt-2 text-xs text-error">
              {errors.jobDescription.message}
            </p>
          )}
        </div>

        {/* Tone + Length */}
        <div className="grid grid-cols-2 gap-4" data-tour="options">
          <div>
            <Label htmlFor="tone" className="mb-2">
              Tone
            </Label>
            <Controller
              control={control}
              name="tone"
              render={({ field }) => (
                <Select
                  id="tone"
                  ariaLabel="Tone"
                  value={field.value}
                  onChange={field.onChange}
                  options={TONE_OPTIONS}
                />
              )}
            />
          </div>
          <div>
            <Label htmlFor="length" className="mb-2">
              Length
            </Label>
            <Controller
              control={control}
              name="length"
              render={({ field }) => (
                <Select
                  id="length"
                  ariaLabel="Length"
                  value={field.value}
                  onChange={field.onChange}
                  options={LENGTH_OPTIONS}
                />
              )}
            />
          </div>
        </div>

        {/* Additional instructions */}
        <div>
          <Label htmlFor="additionalInstructions" className="mb-2">
            Additional Instructions{" "}
            <span className="font-normal text-subtle">(optional)</span>
          </Label>
          <Input
            id="additionalInstructions"
            placeholder="e.g. Mention my experience with React specifically"
            {...register("additionalInstructions")}
          />
          {errors.additionalInstructions && (
            <p className="mt-2 text-xs text-error">
              {errors.additionalInstructions.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          fullWidth
          disabled={isGenerating}
          data-tour="generate"
          className="gap-2 shadow-soft transition-shadow hover:shadow-lift"
        >
          <Icon
            name={isGenerating ? "progress_activity" : "auto_awesome"}
            size={20}
            className={isGenerating ? "animate-spin" : undefined}
          />
          {isGenerating ? "Generating…" : "Generate Cover Letter"}
        </Button>
      </form>
    </Card>
  );
}
