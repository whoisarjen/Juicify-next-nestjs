import Image from "next/image";
import Link from "next/link";
import { FunctionComponent } from "react";
import styles from '../../styles/blog.module.css'

const Blog: FunctionComponent = () => {
    return (
        <div className={styles.blog}>
            <h1>Latest news</h1>
            <div className={styles.grid}>
                {
                    [...Array(9)].map((x, index) =>
                        <Link href={`/blog/${index}`} key={index}>
                            <a>
                                <article>
                                    <Image src="/images/witcher.jpg" width="515" height="290" alt="witcher" />
                                    <h3>Secretlab The Witcher Edition chair</h3>
                                </article>
                            </a>
                        </Link>
                    )
                }
            </div>
        </div >
    );
}

export default Blog;