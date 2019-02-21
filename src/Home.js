import React, { Component } from 'react';

// images
import someone from './img/someone.jpg';
import popular from './img/popular.jpg';
import random from './img/random.jpg';

class Home extends Component {

    render() {
        return (
            <div>
                <h2><img src={someone} alt='someone, somewhere is thinking the same thing as you. (maybe.)' /></h2>

                <h4>n thoughts recorded.<div class='sub'>n matches found.</div></h4>


                <h5>
                    enter a thought. <a href='#' id='detailsBtn'>(what then?)</a>
                    <div id='details' style={{display:'none'}}>
                        we'll let you know if anyone in the past or future has entered basically exactly the same thought.
                        <br />
                        punctuation doesn't count.
                    </div>
                </h5>

                <form id='thoughtForm' action='/' method='post'>
                    <p>
                        <input type='text' class='txt' name='thought' id='thought' size='100' value='' />
                    </p>
                    <p id='counter'>
                        100
                    </p>
                    <p id='error'>
                        error
                    </p>
                    <p>
                        <input type='submit' value='calculate loneliness vector' />
                    </p>
                </form>

                <div id='words'>
                    <h5><img src={popular} alt='popular words' /></h5>
                    {/*<?php foreach ( $words as $word ): ?>*/}
                    {/*<span style='font-size:<?php echo max($word['Word']['count']/$maxWordCount*2,0.5) ?>em'>*/}
                    {/*<?php echo $word['Word']['word'] ?>*/}
                    {/*</span>*/}
                    {/*<?php endforeach ?>*/}
                </div>

                <div id='random'>
                    <h5><img src={random} alt='a random thought' /></h5>
                    random
                </div>
            </div>
        );
    }
}

export default Home;