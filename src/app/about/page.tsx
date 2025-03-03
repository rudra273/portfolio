import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/Button';
import { careerTimeline } from '@/career'


export default function AboutPage() {
  return (
    <div>
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-[20%_80%] gap-8 items-center">
        {/* Left Column: Profile Photo */}
          <div className="flex justify-center">
            <Image
              src="/profile/rudra.jpg"
              alt="Rudrapratap Mohanty"
              width={250}
              height={250}
              className="rounded-full opacity-60 hover:opacity-100 transition-opacity duration-300"
              />
              
          </div>
        {/* Right Column: About Me Text */}
          <div className="text-white bg-black/80 backdrop-blur-sm p-6 rounded-lg">
            <h1 className="text-3xl md:text-2xl font-semibold mb-4 font-roboto text-blue-500">About Me</h1>
            <div className="text-gray-300 leading-relaxed font-poppins text-sm" >
                <p>
                I am currently based in Bangalore, working as a DevOps Engineer. With a strong foundation 
                in software development, I specialize in backend engineering and DevOps, ensuring seamless 
                deployment and scalability of applications. My expertise includes backend frameworks like Django 
                and FastAPI, where I have built high-performance APIs and microservices. On the DevOps side, 
                I have hands-on experience with Kubernetes, automating deployments, and setting up CI/CD pipelines 
                for efficient software delivery. I am actively working on MLOps, leveraging AWS and GCP to streamline 
                model deployment and lifecycle management. Additionally, I have experience working with databases 
                such as PostgreSQL and MongoDB, ensuring efficient data storage and retrieval. Currently, I am 
                expanding my knowledge in LLM engineering, diving deeper into AI and NLP advancements.
                </p>

                <br />

                <p>
                Beyond my professional work, I am deeply passionate about technology and creativity. I enjoy 
                freelancing in my free time, working on passion projects and collaborating with clients to build 
                innovative solutions. Previously, I was a Python trainer, mentoring aspiring developers and sharing 
                my expertise in problem-solving. I love tackling algorithmic challenges on LeetCode, constantly 
                improving my coding skills. Outside of tech, I have a deep fascination with space and astronomy, 
                often exploring the mysteries of the universe. Photography is another creative outlet for me—I 
                love capturing the beauty of nature, preserving moments through my lens. My diverse interests fuel 
                my curiosity and drive, shaping both my professional and personal journey.
                </p>
            </div>
          </div>
        </div>  
      </section>

      <div className="flex justify-center mb-4">
        <Link 
          href="https://drive.google.com/file/d/1_MHQ4po0Yb_a2wmL3KM13WuK-PYNYcjU/view?usp=sharing"
          target="_blank"
        >
          <Button>View CV</Button>
        </Link>
      </div>
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black opacity-90 text-white">
            <div className="container mx-auto">
                <h2 className="text-2xl font-semibold text-center mb-12 font-roboto">Journey</h2>
                <div className="relative flex flex-col items-center">
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-gray-500" />
                    
                    {careerTimeline.map((item, index) => (
                        <div key={index} className="w-full mb-16">
                            <div className="grid grid-cols-2 gap-4 relative">
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full z-10" />
                                
                                <div className={`col-span-1 ${item.position === 'up' ? 'col-start-1' : 'col-start-2'}`}>
                                    <div className={`${item.position === 'up' ? 'text-right mr-8' : 'text-left ml-8'}`}>
                                        <div className="bg-gray-800 rounded-lg shadow-lg inline-block w-full max-w-[250px] text-center 
                                            hover:bg-gray-700 transition-colors duration-300 p-4">
                                            <p className="text-xs font-bold text-gray-300">{item.date}</p>
                                            <h3 className="text-sm font-semibold mt-1">{item.title}</h3>
                                            <p className="text-gray-400 text-xs mt-1">{item.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col items-center mt-4">
                    <div className="w-3 h-3 bg-white rounded-full mb-3" />
                    <p className="text-gray-400 text-sm font-light italic">And The Journey Continues...</p>
                </div>
            </div>
        </section>
    

    </div>
  );
}
