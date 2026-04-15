import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Mail, Plus, ChevronDown } from "lucide-react";

export const dynamic = "force-dynamic";

// Default templates to seed on first visit if table is empty
const DEFAULT_TEMPLATES = [
  {
    slug: "welcome",
    name: "Welcome Email",
    subject: "Welcome to SeaLearn Nigeria, {{name}}!",
    variables: JSON.stringify([
      { name: "name", description: "Student full name", example: "Emeka Okafor" },
      { name: "email", description: "Student email address", example: "emeka@example.com" },
    ]),
    bodyHtml: `<p>Dear {{name}},</p>
<p>Welcome to <strong>SeaLearn Nigeria</strong> — Nigeria's premier maritime training institute.</p>
<p>Your account has been created. You can now log in to the student portal at <a href="https://sealearn.edu.ng/auth/login">sealearn.edu.ng/auth/login</a>.</p>
<p>If you have any questions, please contact our admissions team at <a href="mailto:admissions@sealearn.edu.ng">admissions@sealearn.edu.ng</a> or call <strong>+234 704 280 6167</strong>.</p>
<p>Best regards,<br>SeaLearn Nigeria Admissions Team</p>`,
  },
  {
    slug: "offer-letter",
    name: "Offer Letter",
    subject: "Your SeaLearn Nigeria Offer Letter — {{course}}",
    variables: JSON.stringify([
      { name: "name", description: "Student full name", example: "Emeka Okafor" },
      { name: "course", description: "Course title", example: "Basic Safety Training (BST)" },
      { name: "intake", description: "Intake date", example: "September 2025" },
    ]),
    bodyHtml: `<p>Dear {{name}},</p>
<p>We are pleased to offer you a place on the <strong>{{course}}</strong> programme commencing <strong>{{intake}}</strong>.</p>
<p>Your personalised fee schedule will be sent separately. Please respond to this offer within <strong>7 working days</strong> to secure your place.</p>
<p>Documents required for enrolment confirmation will be listed in your portal.</p>
<p>Congratulations and welcome to SeaLearn Nigeria.</p>
<p>Yours sincerely,<br>Mrs. Amaka Obi<br>Head of Admissions &amp; Student Affairs<br>SeaLearn Nigeria</p>`,
  },
  {
    slug: "fee-quote",
    name: "Fee Quote",
    subject: "Your SeaLearn Nigeria Fee Schedule — {{course}}",
    variables: JSON.stringify([
      { name: "name", description: "Student full name", example: "Emeka Okafor" },
      { name: "course", description: "Course title", example: "GMDSS General Operator Certificate" },
      { name: "fee", description: "Total course fee in Naira", example: "₦350,000" },
      { name: "intake", description: "Intake date", example: "September 2025" },
    ]),
    bodyHtml: `<p>Dear {{name}},</p>
<p>Thank you for your interest in <strong>{{course}}</strong> at SeaLearn Nigeria.</p>
<p>Your personalised fee for the <strong>{{intake}}</strong> intake is: <strong>{{fee}}</strong></p>
<p>Payment can be made via Paystack, Flutterwave, USSD, or bank transfer. Flexible instalment plans are available upon request.</p>
<p>To accept this offer and proceed with enrolment, please reply to this email or log in to your student portal.</p>
<p>Kind regards,<br>SeaLearn Nigeria Admissions Team<br>+234 704 280 6167 | admissions@sealearn.edu.ng</p>`,
  },
  {
    slug: "enrolment-confirmation",
    name: "Enrolment Confirmation",
    subject: "Enrolment Confirmed — {{course}} | SeaLearn Nigeria",
    variables: JSON.stringify([
      { name: "name", description: "Student full name", example: "Emeka Okafor" },
      { name: "course", description: "Course title", example: "Officer of the Watch (Deck)" },
      { name: "start_date", description: "Course start date", example: "10 September 2025" },
    ]),
    bodyHtml: `<p>Dear {{name}},</p>
<p>Your enrolment in <strong>{{course}}</strong> has been confirmed. Your course begins on <strong>{{start_date}}</strong>.</p>
<p>Your SeaLearn LMS access will be activated before the start date. You will receive a separate email with your login link.</p>
<p>Venue: <strong>25A Marine Road, Apapa, Lagos</strong></p>
<p>Please arrive 30 minutes before your first session with original documents for verification.</p>
<p>We look forward to welcoming you.<br>SeaLearn Nigeria</p>`,
  },
  {
    slug: "document-request",
    name: "Missing Documents Request",
    subject: "Action Required: Missing Documents — SeaLearn Nigeria",
    variables: JSON.stringify([
      { name: "name", description: "Student full name", example: "Emeka Okafor" },
      { name: "missing_docs", description: "List of missing documents", example: "WAEC Certificate, NIN Document" },
    ]),
    bodyHtml: `<p>Dear {{name}},</p>
<p>Thank you for submitting your application to SeaLearn Nigeria.</p>
<p>Our admissions team has reviewed your application and requires the following documents to proceed:</p>
<p><strong>{{missing_docs}}</strong></p>
<p>Please upload these documents to your student portal or email them to <a href="mailto:admissions@sealearn.edu.ng">admissions@sealearn.edu.ng</a> within <strong>5 working days</strong>.</p>
<p>If you need assistance, call us on <strong>+234 704 280 6167</strong>.</p>
<p>SeaLearn Nigeria Admissions Team</p>`,
  },
];

export default async function EmailTemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; edit?: string }>;
}) {
  const { saved, edit } = await searchParams;

  // Seed defaults if empty
  const count = await prisma.emailTemplate.count();
  if (count === 0) {
    await prisma.emailTemplate.createMany({ data: DEFAULT_TEMPLATES });
  }

  const templates = await prisma.emailTemplate.findMany({ orderBy: { name: "asc" } });
  const editTemplate = edit ? templates.find((t) => t.id === edit) : null;

  async function saveTemplate(fd: FormData) {
    "use server";
    const id = fd.get("id") as string | null;
    const slug = (fd.get("slug") as string).trim().toLowerCase().replace(/\s+/g, "-");
    const data = {
      slug,
      name: (fd.get("name") as string).trim(),
      subject: (fd.get("subject") as string).trim(),
      bodyHtml: (fd.get("bodyHtml") as string).trim(),
      variables: (fd.get("variables") as string | null) ?? undefined,
      isActive: fd.get("isActive") === "on",
    };
    if (id) {
      await prisma.emailTemplate.update({ where: { id }, data });
    } else {
      await prisma.emailTemplate.create({ data });
    }
    revalidatePath("/admin/email-templates");
    redirect("/admin/email-templates?saved=1");
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="font-cinzel text-2xl font-bold text-navy">Email Templates</h1>
        <p className="text-muted text-sm mt-1">{templates.length} template{templates.length !== 1 ? "s" : ""} — used for automated and manual student communications</p>
      </div>

      {saved && (
        <div className="bg-jade/10 border border-jade/30 text-jade text-sm px-4 py-3 rounded-lg mb-5">
          Template saved successfully.
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Template list */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Templates</div>
          {templates.map((t) => (
            <a
              key={t.id}
              href={`/admin/email-templates?edit=${t.id}`}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                edit === t.id
                  ? "bg-ocean/5 border-ocean/30"
                  : "bg-white border-border hover:border-ocean/30"
              }`}
            >
              <Mail size={16} className={edit === t.id ? "text-ocean mt-0.5" : "text-muted mt-0.5"} />
              <div className="min-w-0">
                <div className="font-semibold text-navy text-sm truncate">{t.name}</div>
                <div className="text-muted text-[11px] font-mono truncate">{t.slug}</div>
                {!t.isActive && (
                  <span className="text-[10px] font-bold uppercase text-muted">Inactive</span>
                )}
              </div>
            </a>
          ))}

          {/* Add new */}
          <a
            href="/admin/email-templates?new=1"
            className="flex items-center gap-2 p-3 rounded-xl border border-dashed border-border text-muted hover:border-teal hover:text-teal transition-colors text-sm"
          >
            <Plus size={16} /> New Template
          </a>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2">
          {editTemplate ? (
            <form action={saveTemplate} className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
              <input type="hidden" name="id" value={editTemplate.id} />
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Template Name</label>
                  <input name="name" required defaultValue={editTemplate.name} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Slug (identifier)</label>
                  <input name="slug" required defaultValue={editTemplate.slug} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Email Subject</label>
                <input name="subject" required defaultValue={editTemplate.subject} placeholder="Use {{variable}} for placeholders" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean" />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Body HTML</label>
                <textarea
                  name="bodyHtml"
                  required
                  rows={14}
                  defaultValue={editTemplate.bodyHtml}
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean resize-y font-mono"
                />
                <p className="text-[11px] text-muted mt-1">Use <code className="bg-surface px-1 rounded">{"{{variable}}"}</code> for dynamic content. HTML is supported.</p>
              </div>
              <details>
                <summary className="text-xs font-bold text-muted cursor-pointer flex items-center gap-1 uppercase tracking-wide">
                  <ChevronDown size={12} /> Variables Reference (JSON)
                </summary>
                <textarea
                  name="variables"
                  rows={4}
                  defaultValue={editTemplate.variables ?? ""}
                  placeholder='[{"name":"name","description":"Student name","example":"Emeka"}]'
                  className="mt-2 w-full px-4 py-2.5 border border-border rounded-lg text-xs outline-none focus:border-ocean resize-y font-mono"
                />
              </details>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="isActive" id="isActive" defaultChecked={editTemplate.isActive} className="accent-teal" />
                <label htmlFor="isActive" className="text-sm text-navy">Active (visible to staff when sending emails)</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-teal text-white font-bold px-6 py-2.5 rounded-lg hover:bg-teal/90 text-sm transition-colors">
                  Save Template
                </button>
                <a href="/admin/email-templates" className="border border-border text-muted px-5 py-2.5 rounded-lg hover:bg-surface text-sm">
                  Cancel
                </a>
              </div>
            </form>
          ) : (
            <div className="bg-white rounded-xl border border-border shadow-sm p-12 text-center">
              <Mail size={40} className="text-muted mx-auto mb-3" />
              <p className="font-bold text-navy mb-1">Select a template to edit</p>
              <p className="text-muted text-sm">Choose a template from the list, or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
