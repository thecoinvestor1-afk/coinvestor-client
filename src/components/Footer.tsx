// --core
import Link from "next/link";

// --components
import Logo from "@components/Logo";
import Image from "next/image";

// --icons
import logo from "@brand/logo-large-faded-blue.svg";
import {
  InstagramLogoIcon,
  FacebookLogoIcon,
  XLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react/dist/ssr";

const Footer = () => {
  const Dynamic = 500;
  return (
    <footer className="container my-10 lg:my-20">
      <div className="flex flex-col justify-between space-y-8 px-0 sm:px-4 lg:px-8 py-12 space-x-10 lg:flex-row">
        <div className="flex flex-col items-start lg:w-[25%]">
          <Logo variant="largeWhite" href="/" />
          <p className="mt-4 leading-loose ">
            Explore over {Dynamic} profile vetted admission profiles from
            top-tier U.S. graduate programs — real stories, real results.
          </p>
        </div>

        <div className="flex flex-col items-start lg:w-[20%]">
          <h3 className="text-base font-bold">Feature</h3>
          <ul className="mt-2 flex flex-col gap-2 text-sm sm:mt-4 sm:gap-3">
            <li>
              <Link
                href="/"
                className=" transition-all duration-300 hover:opacity-100"
              >
                Profiles
              </Link>
            </li>
            <li>
              <Link
                href="/auth/sign-in"
                className=" transition-all duration-300 hover:opacity-100"
              >
                Packages
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className=" transition-all duration-300 hover:opacity-100"
              >
                1 on 1 Couselling
              </Link>
            </li>
            <li>
              <Link
                href="/pricing"
                className=" transition-all duration-300 hover:opacity-100"
              >
                Share your profile
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-start lg:w-[20%]">
          <h3 className="text-base font-bold">Legal</h3>
          <ul className="mt-2 flex flex-col gap-2 text-sm sm:mt-4 sm:gap-3">
            <li>
              <Link
                href="/legal/cookie-policy"
                className=" transition-all duration-300 hover:opacity-100"
              >
                Cookie policy
              </Link>
            </li>
            <li>
              <Link
                href="/legal/privacy-policy"
                className=" transition-all duration-300 hover:opacity-100"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/legal/refund-policy"
                className=" transition-all duration-300 hover:opacity-100"
              >
                Refund Policy
              </Link>
            </li>
            <li>
              <Link
                href="/legal/sub-processors"
                className=" transition-all duration-300 hover:opacity-100"
              >
                Sub processors
              </Link>
            </li>
            <li>
              <Link
                href="/legal/terms-of-service"
                className=" transition-all duration-300 hover:opacity-100"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                href="/legal/trademark-policy"
                className=" transition-all duration-300 hover:opacity-100"
              >
                Trademark Policy
              </Link>
            </li>
            <li>
              <Link
                href="/legal/eu-privacy-policy"
                className=" transition-all duration-300 hover:opacity-100"
              >
                EU & Swiss Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-start lg:w-[20%]">
          <h3 className="text-base font-bold">Company</h3>
          <ul className="mt-2 flex flex-col gap-2 text-sm sm:mt-4 sm:gap-3">
            <li>
              <Link
                href="/blog"
                className=" transition-all duration-300 hover:opacity-100"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/auth/sign-in"
                className=" transition-all duration-300 hover:opacity-100"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className=" transition-all duration-300 hover:opacity-100"
              >
                Sign Up
              </Link>
            </li>
            <li>
              <Link
                href="/about-us"
                className=" transition-all duration-300 hover:opacity-100"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact-us"
                className=" transition-all duration-300 hover:opacity-100"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-start gap-2 ">
          <Link
            href="https://www.instagram.com/admit-vault_com/"
            className="rounded-full transition-all duration-300 hover:opacity-80"
            target="_blank"
            rel="noopener noreferrer"
          >
            <XLogoIcon weight="fill" color="#ffffff" size={28} />
          </Link>
          <Link
            href="https://www.facebook.com/people/admit-vault/61566887740917/"
            className="rounded-full transition-all duration-300 hover:opacity-80"
            target="_blank"
            rel="noopener noreferrer"
          >
            <YoutubeLogoIcon weight="fill" color="#ffffff" size={30} />
          </Link>
          <Link
            href="https://www.linkedin.com/company/admit-vault"
            className="rounded-full transition-all duration-300 hover:opacity-80"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookLogoIcon weight="fill" color="#ffffff" size={30} />
          </Link>
          <Link
            href="https://www.youtube.com/@admit-vault"
            className="rounded-full transition-all duration-300 hover:opacity-80"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramLogoIcon weight="fill" color="#ffffff" size={30} />
          </Link>
        </div>
      </div>
      <div className="relative mt-6 h-24 w-full md:h-48 lg:mt-10 lg:h-72">
        <Image
          src={logo}
          alt="Admit Vault's Logo"
          priority={false}
          sizes="100%"
          fill
          className="object-contain"
        />
      </div>
    </footer>
  );
};

export default Footer;
