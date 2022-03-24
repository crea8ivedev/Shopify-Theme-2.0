<script>
  import PDPFAQSlideover from '../components/PDPFAQSlideover.svelte';

  let question = null;
  let answer = null;
  let showSlideOver = false;
  const faqData = window.productPageData.faq;

  const handleClickFAQ = (index) => {
    const data = faqData[index];
    
    question = data.question;
    answer = data.answer;

    showSlideOver = true;
  };
</script>

{#each faqData as faq, index}
  <div
    class="pdp-more-info__faq-block border-b-2 py-4 flex align-center cursor-pointer"
    on:click={(e) => {
      if (faq.answer) {
        handleClickFAQ(index);
      } else if (faq.redirectUrl) {
        window.location.href = faq.redirectUrl;
      }
    }}
  >
    <h5 class="text-lg font-header tracking-wider uppercase">{faq.question}</h5>
    <svg
      class="ml-auto"
      width="21"
      height="24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ><path
        d="M14.163 9.332c2 1.155 2 4.041 0 5.196L1 22.128V1.732l13.163 7.6z"
        stroke="#000"
        stroke-width="2"
      /></svg
    >
  </div>
  
{/each}

<PDPFAQSlideover bind:showSlideOver={showSlideOver} bind:title={question} bind:content={answer} />