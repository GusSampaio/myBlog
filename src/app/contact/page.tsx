
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Contact Me</h1>
      <form className="max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <Input type="text" id="name" placeholder="Your Name" />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <Input type="email" id="email" placeholder="Your Email" />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message
          </label>
          <Textarea id="message" rows={5} placeholder="Your Message" />
        </div>
        <Button type="submit">Send Message</Button>
      </form>
    </div>
  );
}
