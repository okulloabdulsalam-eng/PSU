import Link from "next/link";
import { BookOpen, Mail } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-dark text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="font-sora font-bold text-xl">PharmaPrep Uganda</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Uganda's dedicated online study platform for pharmacy students preparing for pre-licensure and post-internship licensing examinations. Built by pharmacists, for pharmacists.
            </p>
            <div className="flex items-center gap-2 mt-4 text-gray-400 text-sm">
              <Mail className="h-4 w-4" />
              <a href="mailto:support@pharmaprep.ug" className="hover:text-white transition-colors">support@pharmaprep.ug</a>
            </div>
          </div>

          <div>
            <h4 className="font-sora font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/subjects" className="hover:text-white transition-colors">Subjects</Link></li>
              <li><Link href="/questions" className="hover:text-white transition-colors">Question Bank</Link></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Get Started</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sora font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} PharmaPrep Uganda. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <span className="text-red-500">❤</span>
            <span>in Uganda 🇺🇬</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
