import Link from 'next/link';
import Image from 'next/image';

export default function DealsCards() {
    const uniqueDeals = [
        { image: '/deals/hat.jpg', alt: 'Special Deal 1', href: '/deals/1' },
        { image: '/deals/jean.jpg', alt: 'Special Deal 2', href: '/deals/2' },
        { image: '/deals/jewellery.jpg', alt: 'Special Deal 3', href: '/deals/3' },
        { image: '/deals/hoodie.jpg', alt: 'Special Deal 4', href: '/deals/4' },
        { image: '/deals/shirt1.jpg', alt: 'Special Deal 5', href: '/deals/5' },
        { image: '/deals/shirt2.jpg', alt: 'Special Deal 6', href: '/deals/6' },
        { image: '/deals/jacket.jpg', alt: 'Special Deal 7', href: '/deals/6' },
        { image: '/deals/tshirt.jpg', alt: 'Special Deal 8', href: '/deals/6' }
    ];
    
    const deals = [...uniqueDeals, ...uniqueDeals];

    return (
        /* Mobile: Black background | Desktop: Transparent/Inherit */
        <div className='w-full overflow-hidden '> 
            <div className="marquee-track whitespace-nowrap flex items-center mt-6 md:mt-10 ml-4 md:ml-10">
                {deals.map((deal, index) => (
                    <Link 
                        href={deal.href}
                        key={index}
                        /* Mobile: 25vh height, 22vh width, smaller margin 
                           Desktop: 42vh height, 37vh width, original margin
                        */
                        className='h-[25vh] w-[22vh] md:h-[42vh] md:w-[37vh] rounded-xl md:rounded-2xl ml-4 md:ml-10 mb-10 md:mb-20 shrink-0 overflow-hidden bg-white flex items-center justify-center'
                    >
                        <div className='relative w-full h-full'>
                            <Image
                                src={deal.image}
                                alt={deal.alt}
                                fill
                                sizes="(max-width: 768px) 22vh, 37vh"
                                className='object-cover'
                            />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}